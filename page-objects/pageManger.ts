import{ Page, test, expect } from '@playwright/test'
import { NavigationPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatepickerPage } from '../page-objects/datepickerPage'


export class PageManager {

 private readonly page: Page
 private readonly navigationPage: NavigationPage
 private readonly formLayoutsPage: FormLayoutsPage
 private readonly datepickerPage: DatepickerPage

 /**
 * 
 * @returns Constructor level dependency injection
 * We are not creating new instances of page objects here
 *  rather using the same page instance to create them
 */
    constructor(page: Page) {
        this.page = page
        // this.navigationPage = new NavigationPage(this.page)
        this.formLayoutsPage = new FormLayoutsPage(this.page)
        this.datepickerPage = new DatepickerPage(this.page)
            
    }
/**
 * 
 * @returns Function level dependency injection
 */
    //  navigateTo( navigationPage : NavigationPage) {
    //     return this.navigationPage
    // }
    navigateTo() {
        return this.navigationPage
    }
    onFormLayoutsPage() {
       return this.formLayoutsPage
    }
    onDatepickerPage() {
      return  this.datepickerPage
    }


}