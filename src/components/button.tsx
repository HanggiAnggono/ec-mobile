import clsx from 'clsx'
import { ComponentProps, ReactNode } from 'react'
import { Pressable, PressableProps, Text, View } from 'react-native'
import Icon from './icon'

interface Props extends PressableProps {
  icon?: ComponentProps<typeof Icon>['name']
}

export const Button = ({
  children,
  onPress,
  className,
  icon,
  disabled,
  ...props
}: Props) => {
  return (
    <Pressable
      {...props}
      onPress={onPress}
      className={className}
      disabled={disabled}
    >
      {({ pressed }) => {
        return (
          <View
            className={clsx(
              'flex self-start flex-row items-center gap-2 p-3 py-2 overflow-hidden rounded-full',
              {
                'bg-blue-500': pressed,
              }
            )}
          >
            {icon && (
              <Icon
                name={icon}
                size={20}
                // className={pressed ? 'text-white' : 'text-blue-500'}
                style={{
                  color: disabled ? 'gray' : pressed ? 'white' : '#3B82F6',
                }}
              />
            )}
            <Text
              className={clsx('text-xl text-blue-500', {
                'text-white': pressed,
                'text-gray-300': disabled,
              })}
            >
              {children as ReactNode}
            </Text>
          </View>
        )
      }}
    </Pressable>
  )
}
