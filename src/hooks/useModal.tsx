import { createContext, PropsWithChildren, useContext } from 'react'
import { Modal } from 'antd'

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modal, contextHolder] = Modal.useModal()

  return (
    <ModalContext.Provider value={{ modal }}>
      {contextHolder}
      {children}
    </ModalContext.Provider>
  )
}

const ModalContext = createContext<{ modal: any }>({ modal: {} })

export const useModal = () => {
  return useContext(ModalContext)
}
