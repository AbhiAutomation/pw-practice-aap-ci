export{Page} from'@playwright/test'

export class HelperBase {

    readonly page
    constructor(page) {
        this.page = page
    }

    async waitForTimeInMillisec(millisec: number) {
        await this.page.waitForTimeout(millisec*1000)
    }
}