import { ChangeEvent, useState } from "react"
import StatusCard from "@/components/StatusBar";
import { getNextSundayDate } from "@/lib/utils";

type StatusForm = {
  active: "on" | "off"
  next_date: string
  message: ""
  [key: string]: string
}

export default function StatusUpdater() {

  const [form, setForm] = useState<StatusForm>({
    active: "on",
    next_date: getNextSundayDate(new Date(Date.now())).toLocaleDateString(),
    message: ""
  })

  function handleForm(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.currentTarget;
    const updatedForm = structuredClone(form);
    updatedForm[name] = value;
    setForm(updatedForm);
  }

  function getStatusFromForm(form: StatusForm) {
    return {
      active: form.active === "on",
      next_date: new Date(form.next_date).toLocaleDateString(),
      message: form.message
    }
  }


  return (
    <div className="card">
      <p>Set Open Mic Status:</p>
      <div>
        <p>For Date:</p>
        <input type="date" name="next_date" value={form.next_date}
          onChange={handleForm}
          className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-irish-gold" />
      </div>
      <div>
        <p>Status:</p>
        <label htmlFor="status_on">
          <input id="status_on" type="radio" name="status" value={"on"} onChange={handleForm} />
          On
        </label>
        <label htmlFor="status_off">
          <input id="status_off" type="radio" name="status" value={"off"} onChange={handleForm} />
          Off
        </label>
      </div>
      <div>
        <p>Add message:</p>
        <textarea name="message" value={form.message} onChange={handleForm} />
      </div>

      <div className="">
        <p>Next Open Mic Status Bar Preview:</p>
        <div className="px-12">

          <StatusCard status={getStatusFromForm(form)}></StatusCard>
        </div>
      </div>
    </div>
  )
}