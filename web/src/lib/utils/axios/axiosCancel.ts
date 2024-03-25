/*
MIT License

Copyright (c) 2020-present, Vben

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Referred from src/utils/http/axios/axiosCancel.ts
 */

import type { AxiosRequestConfig } from 'axios'

const pendingMap = new Map<string, AbortController>()

const getPendingUrl = (config: AxiosRequestConfig): string => {
  return [config.method, config.url].join('&')
}

export class AxiosCanceler {
  public addPending(config: AxiosRequestConfig): void {
    this.removePending(config)
    const url = getPendingUrl(config)
    const controller = new AbortController()
    config.signal = config.signal || controller.signal
    if (!pendingMap.has(url)) {
      pendingMap.set(url, controller)
    }
  }

  public removeAllPending(): void {
    pendingMap.forEach(abortController => {
      if (abortController) {
        abortController.abort()
      }
    })
    this.reset()
  }

  public removePending(config: AxiosRequestConfig): void {
    const url = getPendingUrl(config)
    if (pendingMap.has(url)) {
      const abortController = pendingMap.get(url)
      if (abortController) {
        abortController.abort(url)
      }
      pendingMap.delete(url)
    }
  }

  public reset(): void {
    pendingMap.clear()
  }
}