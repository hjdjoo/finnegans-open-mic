import { ChangeEvent, useState } from "react"
import StatusCard from "@/components/StatusBar";
import { getNextSundayDate } from "@/lib/utils";
import createClient from "@/lib/clientSupabase";

type StatusForm = {
  active: "on" | "off"
  next_date: string
  message: ""
  [key: string]: string
}

export default function StatusUpdater() {

  const supabase = createClient();

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
      next_date: getNextSundayDate(new Date(form.next_date)).toLocaleDateString(),
      message: form.message
    }
  }

  async function submitStatus() {

    const status = getStatusFromForm(form);

    const { error } = await supabase
      .from("site_settings")
      .update({ value: status })
      .eq("key", "open_mic_status");

    if (error) throw error;

  }


  return (
    <div className="card">
      <h2 className="text-2xl mb-4">Set Open Mic Status:</h2>
      <div id="update-status"
        className="flex bg-gray-700/50 py-2 px-4 mb-4">
        <div id="status-pick-date"
          className="grow-1 my-2">
          <p className="mb-2">For Date:</p>
          <input type="date" name="next_date" value={form.next_date}
            onChange={handleForm}
            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-irish-gold" />
        </div>
        <div id="status-pick-status"
          className="grow-1 justify-evenly my-2">
          <p className="mb-2">Status:</p>
          <span className="flex justify-evenly">
            <label htmlFor="status_on"
              className="flex flex-col items-center">
              <input id="status_on" type="radio" name="status" value={"on"} onChange={handleForm} />
              On
            </label>
            <label htmlFor="status_off"
              className="flex flex-col items-center">
              <input id="status_off" type="radio" name="status" value={"off"} onChange={handleForm} />
              Off
            </label>
          </span>
        </div>
        <div id="status-leave-message"
          className="grow-1 my-2">
          <p className="mb-2">Add message:</p>
          <textarea name="message"
            className="w-full bg-gray-600/50 focus:ring-irish-gold"
            value={form.message} onChange={handleForm} />
        </div>
      </div>
      <div id="status-preview" className="mb-4">
        <p>Next Open Mic Status Bar Preview:</p>
        <div className="px-2">
          <StatusCard status={getStatusFromForm(form)}></StatusCard>
        </div>
      </div>
      <div id="update-button-box"
        className="flex justify-center">
        <button className="px-4 py-2 transition-all bg-gray-500/50 hover:bg-gray-700/50 hover:cursor-pointer rounded-md" onClick={submitStatus}>
          Update Status
        </button>
      </div>
    </div>
  )
}