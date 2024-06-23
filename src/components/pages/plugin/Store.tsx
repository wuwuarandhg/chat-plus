import { useSiteContext } from '@/contexts/site'
import { Avatar, Button, Card, Drawer, FloatButton, Input, Tag, App, Popconfirm, Space, theme as antdTheme, Tooltip, Typography, Empty, Col, Row, Select, Badge, Alert } from 'antd'
import { StarOutlined, StarFilled, FireFilled, FireOutlined, DisconnectOutlined, ApiFilled, ThunderboltFilled } from '@ant-design/icons'
import { useTranslation } from '@/locales'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Plugin } from '@/types/plugin'
import { usePluginContext } from '@/contexts/plugin'
import { EmptyImage } from '@/config/constant'

import Item from './Item'
import { uuidv4 } from '@/utils'
import Info from './Info'
import { useSize } from 'ahooks'
import _datas from '@/data/plugin'

// let _datas: Plugin[] = [
//   {
//     uuid: uuidv4(),
//     name: 'Zapier',
//     image: 'https://cdn.zappy.app/8f853364f9b383d65b44e184e04689ed.png',
//     intro:
//       'Interact with over 5,000+ apps like Google Sheets, Gmail, HubSpot, Salesforce, and thousands more.Interact with over 5,000+ apps like Google Sheets, Gmail, HubSpot, Salesforce, and thousands more.',
//     description:
//       'Zapier can talk to any of 20k+ actions the user has exposed. Actions are single tasks (EG: add a lead, find a doc), Zaps are workflows of actions. Start new chat to refresh actions. Markdown links are relative to https://zapier.com/.',
//     mail: 'nla@zapier.com',
//     website: 'zapier.com',
//     apiurl: 'https://nla.zapier.com/api/v1/dynamic/openapi.json',
//     namespace: 'Zapier',
//     datetime: '2023/3/20 11:32:26',
//     apply: 'chatgpt',
//     isInstall: true,
//     isStar: true,
//     isNew: true,
//     isRecommend: true,
//     basicPrompts: ['连接我的谷歌表，获取有关我的最新开支的数据'],
//     advancedPrompts: ['建立一个Zapier任务，把我的Gmail附件保存到Dropbox里', '创建一个Zap任务，把我的Instagram照片发到Twitter 上', '建立一个自动化任务，把新的销售领导添加到我的谷歌表格中。'],
//     lang: {
//       zh_CN: {
//         name: 'Zapier',
//         intro: '与超过5,000个应用程序（如Google表格，Gmail，HubSpot，Salesforce等）进行交互。与超过5,000个应用程序（如Google表格，Gmail，HubSpot，Salesforce等）进行交互。',
//         description:
//           'Zapier可以与用户公开的20k +操作中的任何操作进行通信。操作是单个任务（例如：添加线索，查找文档），Zaps是操作的工作流程。开始新的聊天以刷新操作。 Markdown链接相对于https://zapier.com/。',
//       },
//     },
//   },
// ]
// // 复制20个
// for (let i = 0; i < 136; i++) {
//   _datas.push({
//     ..._datas[0],
//     uuid: uuidv4(),
//     // 随机一个是否安装
//     isInstall: Math.random() > 0.5,
//     // 随机一个是否收藏
//     isStar: Math.random() > 0.5,
//     // 随机一个是否官方
//     isNew: Math.random() > 0.5,
//     // 随机一个是否推荐
//     isRecommend: Math.random() > 0.5,
//   })
// }

function OnlinePlugin() {
  const router = useRouter()
  const { token } = antdTheme.useToken()
  const { theme, lang } = useSiteContext()
  const { message, modal, notification } = App.useApp()
  const { pluginList, starPlugin, unstarPlugin, installPlugin, uninstallPlugin } = usePluginContext()
  const { t } = useTranslation()
  const size = useSize(document.body)
  const [open, setOpen] = useState<boolean>(false)
  const [openItem, setOpenItem] = useState<Plugin | null>(null)
  const [search, setSearch] = useState<string>('')
  const [alllist, setAlllist] = useState<Plugin[]>(_datas)
  const [list, setList] = useState<Plugin[]>(_datas)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagsData, setTagsData] = useState<{ [key: string]: string }[]>([
    { key: 'plugin.tag.all', value: 'all', color: '' },
    // 新品
    { key: 'plugin.tag.new', value: 'new', color: 'green' },
    // 推荐
    { key: 'plugin.tag.recommend', value: 'recommend', color: 'red' },
    // 收藏
    { key: 'plugin.tag.star', value: 'star', color: 'orange' },
    // 安装
    { key: 'plugin.tag.install', value: 'install', color: '#2db7f5' },
  ])

  // useEffect(() => {
  //   searchRequest()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    // 判断是否存在已经安装过
    const _list = list?.map((item) => {
      let index = pluginList.findIndex((tt) => item.uuid == tt.uuid)
      if (index > -1) {
        item.isInstall = true
      }
      return item
    })
    setList(_list)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pluginList])

  useEffect(() => {
    // 通过标签筛选
    let _isAll = false
    let _isRecommend = false
    let _isInstall = false
    let _isStar = false
    let _isNew = false
    if (selectedTags.length > 0) {
      selectedTags.map((tag) => {
        if (tag == 'all') {
          _isAll = true
        } else if (tag == 'recommend') {
          _isRecommend = true
          _isAll = false
        } else if (tag == 'install') {
          _isInstall = true
          _isAll = false
        } else if (tag == 'star') {
          _isStar = true
          _isAll = false
        } else if (tag == 'new') {
          _isNew = true
          _isAll = false
        }
      })
    }
    const _list = alllist.filter((item: Plugin) => {
      // 通过搜索筛选
      if (search) {
        if (
          item?.name?.indexOf(search) == -1 &&
          item?.intro?.indexOf(search) == -1 &&
          item?.description?.indexOf(search) == -1 &&
          item?.lang?.[lang]?.name?.indexOf(search) == -1 &&
          item?.lang?.[lang]?.intro?.indexOf(search) == -1 &&
          item?.lang?.[lang]?.description?.indexOf(search) == -1
        ) {
          return false
        }
      }
      if (_isAll) return true
      // 如果多个标签都选中了，则所有标签都需要符合
      if (_isRecommend && !item.isRecommend) return false
      if (_isInstall && !item.isInstall) return false
      if (_isStar && !item.isStar) return false
      if (_isNew && !item.isNew) return false
      return true
    })
    // console.log('_list', _list?.length, _list)
    setList(_list)
  }, [search, lang, selectedTags, alllist])

  const searchRequest = () => {
    console.log('searchRequest', search)
    // !todo 查询线上数据
  }

  const toStar = (item: Plugin) => {
    if (item.isStar) {
      unstarPlugin(item?.uuid)
      setOpenItem({ ...item, isStar: false })
      message.success(t('plugin.tag.unstarSuccess'))
    } else {
      starPlugin(item)
      setOpenItem({ ...item, isStar: true })
      message.success(t('plugin.tag.starSuccess'))
    }
  }

  const toInstall = (item: Plugin) => {
    if (item.isInstall) {
      uninstallPlugin(item?.uuid)
      setOpenItem({ ...item, isInstall: false })
      message.success(t('plugin.tag.uninstallSuccess'))
    } else {
      installPlugin(item)
      setOpenItem({ ...item, isInstall: true })
      message.success(t('plugin.tag.installSuccess'))
    }
  }

  const toChat = (item: Plugin) => {
    router.push(`/chat`)
  }

  const openInfo = (item: Plugin) => {
    setOpenItem(item)
    setOpen(true)
  }
  return (
    <div style={{ border: '0px solid #efeff5', flex: 1, padding: '16 16 0 16', display: 'flex', flexDirection: 'column', overflow: 'auto', width: '100%' }}>
      <div
        style={{
          height: 64,
          // borderRight: `${theme === 'dark' ? 0 : 1}px solid ${token.colorBorder}`,
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: theme == 'dark' ? token.colorBgContainer : '#fff',
          color: theme === 'dark' ? '#eee' : undefined,
          borderBottom: `1px solid ${theme == 'dark' ? '#424242' : '#e8e8e8'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 9,
          right: 0,
          left: 0,
          padding: '16px',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space size={[0, 8]} wrap>
            {tagsData.map((tag) => (
              <Tag.CheckableTag
                key={tag.value}
                checked={selectedTags.includes(tag.value)}
                onChange={(checked) => {
                  if (tag.value === 'all') {
                    if (checked) {
                      // 去掉其他的
                      setSelectedTags([tag.value])
                    } else {
                      setSelectedTags([])
                    }
                  } else {
                    // 去掉all
                    if (checked) {
                      setSelectedTags([...selectedTags.filter((item) => item !== 'all'), tag.value])
                    } else {
                      setSelectedTags(selectedTags.filter((item) => item !== tag.value))
                    }
                  }
                }}
              >
                {tag?.color && <Badge color={tag?.color} />}
                <span style={{ marginLeft: tag?.color ? 5 : 0 }}>{t(tag?.key)}</span>
              </Tag.CheckableTag>
            ))}
          </Space>
        </div>
        <Space>
          <Space.Compact style={{ width: '100%' }}>
            <Input.Search allowClear placeholder={t('plugin.searchPlaceholder') as string} value={search} onChange={(e) => setSearch(e.target.value)} onPressEnter={searchRequest} />
          </Space.Compact>
        </Space>
      </div>
      <div id="messageBox" style={{ flex: 1, padding: '16 16 16 16', position: 'relative', overflowX: 'hidden', overflowY: 'auto' }}>
        {list.length <= 0 ? (
          <Empty style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}></Empty>
        ) : (
          <Row style={{ flexWrap: 'wrap', paddingLeft: 8, paddingTop: 8 }} gutter={[16, 16]}>
            {list.map((item: Plugin) => {
              return (
                <Col key={item.uuid} span={6} xs={24} sm={12} md={8} lg={8} xl={6} xxl={6}>
                  <Item info={item} openInfo={() => openInfo(item)} />
                </Col>
              )
            })}
          </Row>
        )}
        <Alert
          message="插件功能开发中, 有问题提issue或者pr新功能"
          type="warning"
          style={{ left: 'calc( 50% - 200px)', bottom: '20px', top: 'auto', position: 'absolute' }}
          showIcon
          action={
            <Button
              size="small"
              type="link"
              onClick={() => {
                window.open('https://github.com/zhpd/chatgpt-plus/issues')
              }}
            >
              issue
            </Button>
          }
          closable
        />
        <FloatButton.BackTop
          style={{ marginBottom: 105, marginRight: 16 }}
          // @ts-ignore
          target={() => {
            return document.getElementById('messageBox')
          }}
        />
      </div>
      <Drawer
        title={(openItem as Plugin)?.name || t('c.plugin')}
        onClose={() => setOpen(false)}
        extra={
          <Space>
            {(openItem as Plugin)?.isRecommend && (
              <Button
                type={openItem?.isRecommend ? 'default' : 'dashed'}
                title={t('plugin.tag.recommend') as string}
                style={{ color: openItem?.isRecommend ? token.colorError : token.colorTextLabel }}
                icon={(openItem as Plugin)?.isRecommend ? <FireFilled color={token.colorError} /> : <FireOutlined color={token.colorTextLabel} />}
                onClick={() => {}}
              ></Button>
            )}
            {(openItem as Plugin)?.isNew && (
              <Button
                type={openItem?.isNew ? 'default' : 'dashed'}
                title={t('plugin.tag.new') as string}
                style={{ color: openItem?.isNew ? 'green' : token.colorTextLabel }}
                icon={(openItem as Plugin)?.isNew ? <ThunderboltFilled color={'green'} /> : <ThunderboltFilled color={token.colorTextLabel} />}
                onClick={() => {}}
              ></Button>
            )}
            <Button
              type={openItem?.isStar ? 'default' : 'dashed'}
              title={t('plugin.tag.star') as string}
              style={{ color: openItem?.isStar ? token.colorWarning : token.colorTextLabel }}
              icon={(openItem as Plugin)?.isStar ? <StarFilled color={token.colorWarning} /> : <StarOutlined color={token.colorTextLabel} />}
              onClick={() => {
                toStar(openItem as Plugin)
              }}
            ></Button>
            <Button
              type={openItem?.isInstall ? 'default' : 'dashed'}
              title={t('plugin.tag.install') as string}
              style={{ color: openItem?.isInstall ? '#2db7f5' : token.colorTextLabel }}
              icon={(openItem as Plugin)?.isInstall ? <ApiFilled color={'#2db7f5'} /> : <DisconnectOutlined color={token.colorTextLabel} />}
              onClick={() => {
                toInstall(openItem as Plugin)
              }}
            ></Button>
          </Space>
        }
        footer={
          <Space align={'end'} style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button
              type={openItem?.isInstall ? 'default' : 'primary'}
              onClick={() => {
                toInstall(openItem as Plugin)
              }}
            >
              {openItem?.isInstall ? t('plugin.tag.uninstall') : t('plugin.tag.install')}
            </Button>
          </Space>
        }
        open={open}
        width={578}
        height={'80%'}
        destroyOnClose={true}
        placement={(size?.width as number) <= 1024 ? 'bottom' : 'right'}
      >
        <Info plugin={openItem as Plugin} />
      </Drawer>
    </div>
  )
}

export default OnlinePlugin
