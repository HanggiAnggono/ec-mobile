import clsx from 'clsx'
import { Platform, Pressable, PressableProps, Text } from 'react-native'

export const Button = (props: PressableProps) => {
  return (
    <Pressable {...props} onPress={props.onPress}>
      {typeof props.children === 'string' ? (
        <Text
          className={
            Platform.OS === 'ios'
              ? 'text-blue-500 active:text-white text-xl bg-transparent active:bg-blue-50 p-2 rounded-full'
              : ''
          }
        >
          {props.children}
        </Text>
      ) : (
        props.children
      )}
    </Pressable>
  )
}
