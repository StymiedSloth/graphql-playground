
import {Session} from './types'
export default class PlaygroundStorage {
  private projectId: string
  private project: any
  private storages: any = {}
  constructor(projectId: string) {
    this.projectId = projectId

    this.project = this.getProject()

    if (!this.project) {
      this.project = {}
      this.saveProject()
    }
    global['s'] = this
  }

  public getSessionStorage(sessionId: string) {
    if (this.storages[sessionId]) {
      return this.storages[sessionId]
    }
    const prefix = `${this.projectId}:${sessionId}:`
    const store = {
      clear: () => {
        Object.keys(localStorage)
          .filter((key: string) => key.startsWith(prefix))
          .forEach(key => localStorage.removeItem(key))
      },
      getItem: (key: string) => {
        return localStorage.getItem(prefix + key)
      },
      setItem: (key: string, item: string) => {
        return localStorage.setItem(prefix + key, item)
      },
      removeItem: (key: string) => {
        return localStorage.removeItem(prefix + key)
      }
    }
    this.storages[sessionId] = store
    return store
  }

  public getSessions() {
    return Object.keys(this.project).filter(key => key !== 'undefined').map(sessionId => this.project[sessionId])
  }

  public saveSession(session: Session, save: boolean = true) {
    this.project[session.id] = session
    if (save) {
      this.saveProject()
    }
  }

  public saveProject() {
    const json = JSON.stringify(this.project)
    localStorage.setItem(this.projectId, json)
  }

  private getProject() {
    let result: any = null
    try {
      result = JSON.parse(localStorage.getItem(this.projectId) || '')
    } catch (e) {}
    return result
  }

  // private clearSession(sessionId: string) {
  //   this.project[sessionId] = {}
  //   this.saveProject()
  // }

  // private getSessionItem(key: string, sessionId: string) {
  //   return this.project[sessionId][key]
  // }
  //
  // private setSessionItem(key: string, item: string, sessionId: string, save: boolean) {
  //   if (typeof sessionId === 'undefined' || sessionId === 'undefined') {
  //     console.log('Whoopsy oopsy', arguments)
  //     return
  //   }
  //   this.project[sessionId][key] = item
  //   if (save) {
  //     this.saveProject()
  //   }
  // }
  //
  // private removeSessionItem(key: string, sessionId: string) {
  //   delete this.project[sessionId][key]
  //   this.saveProject()
  // }
}