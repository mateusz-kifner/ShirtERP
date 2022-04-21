import { FC } from "react"
import { message, Modal } from "antd"

import axios from "axios"
import Logger from "js-logger"
import useForm from "antd/lib/form/hooks/useForm"

import Form from "../../components/form/Form"

interface OrderAddModalProps {
  title: string
  visible: boolean
  setVisible: (visible: boolean) => void
  data: any
  onUpdate?: () => void
}

const OrderAddModal: FC<OrderAddModalProps> = ({
  title,
  visible,
  setVisible,
  data,
  onUpdate,
}) => {
  const [form] = useForm()
  const onSubmit = (data: any) => {
    console.log(data)

    axios
      .post("/orders", { data })
      .then(function (response) {
        Logger.info({ ...response, message: "zamówienie dodane" })
        message.success("Zamówienie dodane")
        onUpdate && onUpdate()
        setVisible(false)
      })
      .catch(function (error) {
        Logger.info({ ...error, message: "błąd w dodawaniu zamówienia" })
        form.resetFields()
        setVisible(false)
      })
  }

  return (
    <Modal
      title={title}
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      width={800}
      okText="Dodaj zamówienie"
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onSubmit(values)
            form.resetFields()
          })
          .catch((info) => {
            console.log("Validate Failed:", info)
          })
      }}
    >
      <Form
        form={form}
        wrapperCol={{ span: 16 }}
        labelCol={{ span: 8 }}
        data={data}
        onFinish={onSubmit}
        onFinishFailed={() => {
          form.resetFields()
          setVisible(false)
        }}
      />
    </Modal>
  )
}

export default OrderAddModal