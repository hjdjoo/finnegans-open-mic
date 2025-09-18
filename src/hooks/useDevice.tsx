import { useEffect, useState } from "react";

export default function useDevice() {

  const [size, setSize] = useState()

  useEffect(() => {

    console.log(window);

  }, [])


}