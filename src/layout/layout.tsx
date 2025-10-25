import { LinearGradient } from '@/components/gradient'
import { ColorValue, useColorScheme, View, ViewProps } from 'react-native'

const dark: readonly [ColorValue, ColorValue, ...ColorValue[]] = [
  'rgb(0,200,0)',
  'rgb(0,100,0)',
  'rgb(0, 50, 0)',
  'rgb(0,20,0)',
  'rgb(0,0,0)',
]

const light: readonly [ColorValue, ColorValue, ...ColorValue[]] = [
  'rgba(0,200,0,1)',
  '#72ec72',
  'rgb(216, 255, 216)',
  'rgba(206, 250, 206, 1)',
  'rgba(255, 255, 255, 1)',
]

export const Layout = (props: ViewProps) => {
  const scheme = useColorScheme()
  const colors: readonly [ColorValue, ColorValue, ...ColorValue[]] =
    scheme === 'dark' ? dark : light

  return (
    <View
      {...props}
      className={`flex flex-1 bg-black ${props.className || ''}`}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        // locations={[0, 0.1]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
        }}
      />
      {props.children}
    </View>
  )
}
