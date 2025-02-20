import { useEffect, useState } from 'react'

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<string>('mobile')

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (
      /mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(
        userAgent
      )
    ) {
      setDeviceType('mobile')
    } else if (/ipad|tablet|kindle|playbook|silk/i.test(userAgent)) {
      setDeviceType('tablet')
    } else {
      setDeviceType('desktop')
    }
  }, [])

  return deviceType
}
export default useDeviceType
