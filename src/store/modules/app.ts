import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies'
import { getIndexData } from '@/services/dtsRank/index'
import store from '@/store'

const createAuthMap = (arr:any[]) :object => {
  let authMap:any = {}
  for (let item of arr) {
    for (let i of item.items) {
      authMap[i.type] = i.is_allow
    }
  }
  return authMap
}

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }
  public device = DeviceType.Desktop
  public authMap = {}

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    if (this.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  @Mutation
  private SET_AUTH_MAP(authMap:{}) {
    this.authMap = authMap
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  /**
   * @message: 请求权限配置字典
   * @parameter:
   * @Return:
   * @Date: 2019-09-26 15:47:51
   */
  @Action
  public async getAuhMap() {
    const resData = await getIndexData<IResponseData>()
    const { ok, data } = resData
    if (!ok) return
    this.SET_AUTH_MAP(createAuthMap(data))
  }
}

export const AppModule = getModule(App)
