/**
 * @jest-environment jsdom
 */

 import { screen, fireEvent } from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import { localStorageMock } from "../__mocks__/localStorage.js"
 import { ROUTES } from "../constants/routes.js"
 import Logout from "../containers/Logout.js"
 import mockStore from "../__mocks__/store"
 import store from "../app/Store.js"
 import userEvent from '@testing-library/user-event'

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

   describe("When I am on NewBill Page and I have not filled fields, I submit the form", () => {
    test("Then we should stay on the same page", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const html = NewBillUI()
      document.body.innerHTML = html

      const handleSubmit = jest.fn((e) => e.preventDefault())
      const form = screen.getByTestId('form-new-bill')
      const datepicker = screen.getByTestId("datepicker")
      expect(datepicker.value).toBe("")
      const pct = screen.getByTestId("pct")
      expect(pct.value).toBe("")
      const file = screen.getByTestId("file")
      expect(file.value).toBe("")

      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
      expect(handleSubmit).toHaveBeenCalled()
    })
  })


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

// describe("When I am on NewBill Page and I click on disconnect button", () => {
//   test("Then we should go to login page", () => {
//     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//     window.localStorage.setItem('user', JSON.stringify({
//       type: 'Employee'
//     }))

//     const html = NewBillUI()
//     document.body.innerHTML = html

//     const onNavigate = (pathname) => {
//       document.body.innerHTML = ROUTES({ pathname })
//     }

//     const logout = new Logout({ document, onNavigate, localStorage })
//     const handleClick = jest.fn(logout.handleClick)

//     const disco = screen.getByTestId('layout-disconnect')
//     disco.addEventListener('click', handleClick)
//     userEvent.click(disco)
//     expect(handleClick).toHaveBeenCalled()
//     expect(screen.getByText('Administration')).toBeTruthy()
//   })
// })


describe('Given I am connected', () => {
  describe('When I click on disconnect button', () => {
    test(('Then, I should be sent to login page'), () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = NewBillUI()
      const logout = new Logout({ document, onNavigate, localStorage })
      const handleClick = jest.fn(logout.handleClick)
      screen.getByText('Envoyer une note de frais')
      const disco = document.querySelector("#layout-disconnect")
      disco.addEventListener('click', handleClick)
      userEvent.click(disco)
      expect(handleClick).toHaveBeenCalled()
      expect(screen.getByText('Administration')).toBeTruthy()
    })
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
        expect(screen.getByText('Mes notes de frais')).toBeTruthy()
    })
  })
 })

