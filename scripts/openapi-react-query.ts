import * as ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'

interface CodegenConfig {
  inputFile: string
  outputDir: string
}

interface EndpointInfo {
  path: string
  method: string
  operationId: string
  hasPathParams: boolean
  hasQueryParams: boolean
  hasRequestBody: boolean
  requestBodyType?: string
  responseType?: string
}

class OpenAPIReactQueryCodegen {
  private program: ts.Program
  private endpoints: EndpointInfo[] = []
  private sourceFile!: ts.SourceFile

  constructor(private config: CodegenConfig) {
    const absolutePath = path.resolve(config.inputFile)
    this.program = ts.createProgram([absolutePath], {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
    })
  }

  generate() {
    const absolutePath = path.resolve(this.config.inputFile)
    const sourceFile = this.program.getSourceFile(absolutePath)

    if (!sourceFile) {
      throw new Error(`Source file not found: ${absolutePath}`)
    }

    this.sourceFile = sourceFile
    this.extractEndpoints(sourceFile)
    // write one file per endpoint, grouped by root path
    this.generateHooksByFolders()
  }

  private extractEndpoints(sourceFile: ts.SourceFile) {
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isInterfaceDeclaration(node) && node.name.text === 'paths') {
        this.parsePaths(node)
      }
    })
  }

  private parsePaths(pathsInterface: ts.InterfaceDeclaration) {
    pathsInterface.members.forEach((member) => {
      if (
        ts.isPropertySignature(member) &&
        member.name &&
        ts.isStringLiteral(member.name)
      ) {
        const path = member.name.text
        const hasPathParams = path.includes('{') && path.includes('}')

        if (member.type && ts.isTypeLiteralNode(member.type)) {
          member.type.members.forEach((methodMember) => {
            if (ts.isPropertySignature(methodMember) && methodMember.name) {
              const method = methodMember.name
                .getText(this.sourceFile)
                .replace(/['"]/g, '')

              if (
                ['get', 'post', 'put', 'patch', 'delete'].includes(method) &&
                methodMember.type
              ) {
                const operationId = this.extractOperationId(methodMember.type)
                if (operationId) {
                  this.endpoints.push({
                    path,
                    method,
                    operationId,
                    hasPathParams,
                    hasQueryParams: false, // Will be determined from operations
                    hasRequestBody: ['post', 'put', 'patch'].includes(method),
                    requestBodyType: this.getRequestBodyType(operationId),
                    responseType: this.getResponseType(operationId),
                  })
                }
              }
            }
          })
        }
      }
    })
  }

  private extractOperationId(typeNode: ts.TypeNode): string | null {
    if (ts.isIndexedAccessTypeNode(typeNode)) {
      // Check if it's operations["..."]
      if (
        ts.isTypeReferenceNode(typeNode.objectType) &&
        ts.isIdentifier(typeNode.objectType.typeName) &&
        typeNode.objectType.typeName.text === 'operations'
      ) {
        // Extract the string literal from the index
        if (ts.isLiteralTypeNode(typeNode.indexType)) {
          const literal = typeNode.indexType.literal
          if (ts.isStringLiteral(literal)) {
            console.log('Extracted operation ID:', literal.text)
            return literal.text
          }
        }
      }
    }

    // console.log(
    //   'Could not extract operation ID from:',
    //   typeNode.getText(this.sourceFile)
    // )
    return null
  }

  private getRequestBodyType(operationId: string): string | undefined {
    // For now, we'll infer from the operation name
    // In a full implementation, you'd parse the operations interface
    if (operationId.includes('create') || operationId.includes('Create')) {
      return `components['schemas']['Create${this.getEntityFromOperation(operationId)}Dto']`
    }
    if (operationId.includes('update') || operationId.includes('Update')) {
      return `components['schemas']['Update${this.getEntityFromOperation(operationId)}Dto']`
    }
    if (
      operationId.includes('addToCart') ||
      operationId.includes('AddToCart')
    ) {
      return `components['schemas']['AddToCartDto']`
    }
    return undefined
  }

  private getResponseType(operationId: string): string {
    const entity = this.getEntityFromOperation(operationId)

    if (operationId.includes('findAll') || operationId.includes('FindAll')) {
      return `components['schemas']['${entity}'][]`
    }

    return `components['schemas']['${entity}']`
  }

  private getEntityFromOperation(operationId: string): string {
    // Extract entity name from operation ID
    const parts = operationId.split('_')
    if (parts.length > 1) {
      const controllerPart = parts[0]
      return controllerPart.replace('Controller', '')
    }
    return 'Unknown'
  }

  // Replace the single-file generator with a per-folder, per-endpoint file generator
  private generateHooksByFolders() {
    const grouped = new Map<string, EndpointInfo[]>()

    for (const ep of this.endpoints) {
      const folder = this.getRootFolderName(ep.path)
      if (!grouped.has(folder)) grouped.set(folder, [])
      grouped.get(folder)!.push(ep)
    }

    for (const [folder, eps] of grouped.entries()) {
      const dir = path.join(this.config.outputDir, folder)
      fs.mkdirSync(dir, { recursive: true })

      for (const ep of eps) {
        const hookName = this.getHookName(ep)
        const kind = ep.method === 'get' ? 'query' : 'mutation'
        const fileName = `${this.toKebabCase(hookName)}.${kind}.ts`
        const filePath = path.join(dir, fileName)
        const content = this.generateFileContent(ep)
        fs.writeFileSync(filePath, content)
        console.log(`Generated: ${filePath}`)
      }
    }
  }

  private getRootFolderName(p: string): string {
    const clean = p.replace(/^\//, '')
    const root = clean.split('/')[0] || 'root'
    return root.replace(/[{}]/g, '') || 'root'
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[_\s]+/g, '-')
      .toLowerCase()
  }

  private generateFileContent(endpoint: EndpointInfo): string {
    const imports = `// This file is auto-generated by scripts/openapi-react-query.ts
// Do not edit this file directly.

import { apiClient } from '@/module/core'
import type { operations } from '@/shared/types/api'
import type { FetchOptions } from "openapi-fetch"
import { OpenapiQueryClient } from "openapi-react-query"

`
    const hook = this.generateHook(endpoint)
    return imports + hook + '\n'
  }

  private generateHook(endpoint: EndpointInfo): string {
    const hookName = this.getHookName(endpoint)
    const pathWithParams = this.convertPathParams(endpoint.path)

    if (endpoint.method === 'get') {
      return this.generateQueryHook(endpoint, hookName, pathWithParams)
    } else {
      return this.generateMutationHook(endpoint, hookName, pathWithParams)
    }
  }

  private getHookName(endpoint: EndpointInfo): string {
    const { method, operationId } = endpoint

    const [moduleName, serviceName] = operationId.split('_')

    return `use${moduleName.replace('Controller', '')}${serviceName.charAt(0).toUpperCase()}${serviceName.slice(1)}`
  }

  private convertPathParams(path: string): string {
    // Convert {id} to ${id}
    return path.replace(/{([^}]+)}/g, '${$1}')
  }

  private generateQueryHook(
    endpoint: EndpointInfo,
    hookName: string,
    pathWithParams: string
  ): string {
    const responseType = endpoint.responseType || 'unknown'

    if (endpoint.hasPathParams) {
      const pathParams = this.extractPathParams(endpoint.path)
      const paramTypes = pathParams
        .map((param) => `${param}: string`)
        .join(', ')

      return `export const ${hookName} = (
        fetchOptions?: FetchOptions<operations['${endpoint.operationId}']>,
        options?: Parameters<OpenapiQueryClient<'${endpoint.method}', '${endpoint.path}'>['useQuery']>['3']
      ) => {
    // @ts-ignore
    return apiClient.useQuery('${endpoint.method}', '${endpoint.path}' as const, fetchOptions, options)
  }`
    } else {
      return `export const ${hookName} = (fetchOptions?: FetchOptions<operations['${endpoint.operationId}']>) => {
    return apiClient.useQuery('${endpoint.method}', '${endpoint.path}' as const, fetchOptions)
  }`
    }
  }

  private generateMutationHook(
    endpoint: EndpointInfo,
    hookName: string,
    pathWithParams: string
  ): string {
    const requestBodyType = endpoint.requestBodyType

    const params = `options?: Parameters<OpenapiQueryClient<'${endpoint.method}', '${endpoint.path}'>['useMutation']>['2']`

    if (endpoint.hasPathParams && requestBodyType) {
      const paramType = this.extractPathParamTypes(endpoint.path)
      return `export const ${hookName} = (${params}) => {
      // @ts-ignore
    return apiClient.useMutation('${endpoint.method}', '${endpoint.path}' as const, options)
  }`
    } else if (endpoint.hasPathParams) {
      const paramType = this.extractPathParamTypes(endpoint.path)
      return `export const ${hookName} = (${params}) => {
      // @ts-ignore
    return apiClient.useMutation('${endpoint.method}', '${endpoint.path}' as const, options)
  }`
    } else if (requestBodyType) {
      return `export const ${hookName} = (${params}) => {
      // @ts-ignore
    return apiClient.useMutation('${endpoint.method}', '${endpoint.path}' as const, options)
  }`
    } else {
      return `export const ${hookName} = (${params}) => {
      // @ts-ignore
    return apiClient.useMutation('${endpoint.method}', '${endpoint.path}' as const, options)
  }`
    }
  }

  private extractPathParams(path: string): string[] {
    const params = path.match(/{([^}]+)}/g)
    if (!params) return []

    return params.map((param) => param.slice(1, -1)) // Remove { and }
  }

  private extractPathParamTypes(path: string): string {
    const params = this.extractPathParams(path)

    return params.map((param) => `${param}: string`).join(', ')
  }
}

// Usage
const config: CodegenConfig = {
  inputFile: './src/shared/types/api.ts',
  outputDir: './src/shared/query',
}

new OpenAPIReactQueryCodegen(config).generate()
