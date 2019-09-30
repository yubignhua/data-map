import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies'
import store from '@/store'

export enum DeviceType {
  Mobile,
  Desktop,
}

@Module({ dynamic: true, store, name: 'test' })
class App extends VuexModule {
  public testSidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }
  public testDevice = DeviceType.Desktop

  @Mutation
  public getAction() {
    console.log('test-action')
  }

  @Action
  public TestToggleSideBar(withoutAnimation: boolean) {
    this.getAction()
  }
}

export const TestModule = getModule(App)
