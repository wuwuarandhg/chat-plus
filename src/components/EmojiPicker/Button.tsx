import React from 'react'
import { Button, Tooltip } from 'antd'
import EmojiPicker from './index'
import Image from 'next/image'

const ButtonEmojiPicker = (props: {
  value?: ''
  readOnly?: boolean
  onChange?: (val: any) => void
  onEmojiClick?: (emoji: any) => void
  theme?: 'auto' | 'light' | 'dark'
  style?: 'native' | 'apple' | 'google' | 'facebook' | 'microsoft' | 'bubble'
}) => {
  const [_value, setValue] = React.useState(props.value)
  return (
    <Tooltip
      placement="bottom"
      destroyTooltipOnHide={true}
      trigger={'click'}
      overlayStyle={{ maxWidth: 'auto' }}
      overlayInnerStyle={{ maxWidth: 'auto' }}
      color={'#00000000'}
      style={{ maxWidth: 'auto' }}
      open={props.readOnly ? false : undefined}
      title={
        <EmojiPicker
          theme={props?.theme}
          style={props?.style}
          onEmojiClick={(emoji: any) => {
            props?.onEmojiClick?.(emoji)
            props?.onChange?.(emoji.imageUrl)
            setValue(emoji.imageUrl)
          }}
        />
      }
    >
      <Button size={'middle'} type="dashed" style={{ height: '38px', overflow: 'hidden', padding: '0 auto' }}>
        {_value && <Image src={_value} width={30} height={30} style={{ width: 30, height: 30, overflow: 'hidden' }} alt={''} />}
      </Button>
    </Tooltip>
  )
}

export default ButtonEmojiPicker
