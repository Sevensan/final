/**
 * @jest-environment jsdom
 */

 import { screen, fireEvent } from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import { localStorageMock } from "../__mocks__/localStorage.js"
 import { ROUTES } from "../constants/routes.js"
 import mockStore from "../__mocks__/store"
 import store from "../app/Store.js"

  describe("Given I am connected as an employee", () => {
   describe("When I am on NewBill Page and I am adding a valid file", () => {
     test("Then this file should be added to the input", () => {
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))

       const html = NewBillUI()
       document.body.innerHTML = html

       const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
       const newNewBill = new NewBill({
         document,
         onNavigate,
         store,
         localStorage: window.localStorage
       })
       const handleChangeFile = jest.fn(() => newNewBill.handleChangeFile)
       const file = screen.getByTestId('file')
       file.addEventListener('change', handleChangeFile)
       fireEvent.change(file, {
         target: {
           files: [new File(['file'], 'file.png', {type: 'image/png'})]
         }
       })
       expect(file.files[0].name).toBe('file.png')
       expect(handleChangeFile).toHaveBeenCalled()
     })
   })

// EN COURS
describe("When I am on NewBill Page and I am adding an invalid file", () => {
  test("Then we should stay on the same page", () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))

    const html = NewBillUI()
    document.body.innerHTML = html

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    const newNewBill = new NewBill({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage
    })
    const handleSubmit = jest.fn(() => newNewBill.handleSubmit)
    newNewBill.fileName = 'invalid format'
    const form = screen.getByTestId('form-new-bill')
    form.addEventListener('submit', handleSubmit)
    fireEvent.submit(form)
    expect(newNewBill.fileName).toBe('invalid format')
    expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    expect(handleSubmit).toHaveBeenCalled()
  })
})



 })

 // test intégration POST
 describe('Given I am a user connected as Employee', () => {
  describe('When I create a new Bill', () => {
    test('send bill to mock API POST', async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        const html = NewBillUI()
        document.body.innerHTML = html

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const newNewBill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage
        })
        const handleSubmit = jest.fn(newNewBill.handleSubmit)
        const form = screen.getByTestId('form-new-bill')
        newNewBill.updateBill = jest.fn().mockResolvedValue({})
        form.addEventListener("submit", handleSubmit)
        fireEvent.submit(form)
        expect(handleSubmit).toHaveBeenCalled()
        expect(newNewBill.updateBill).toHaveBeenCalled()
    })
  })
 })

