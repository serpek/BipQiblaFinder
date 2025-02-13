import { PropsWithChildren } from 'react'
import * as motion from 'motion/react-client'

type CompassViewProps = PropsWithChildren<{
  rotate: number
  qible: number
  width: number
  height: number
}>

export const CompassWithHTML = ({
  rotate,
  qible,
  width,
  height
}: CompassViewProps) => {
  return (
    <>
      <div
        className="compass"
        style={{
          width,
          height,
          backgroundImage: 'url(/assets/compass-4.png)',
          backgroundSize: 'cover',
          borderRadius: '50%',
          position: 'relative',
          margin: '0 auto',
          transform: `rotate(${rotate}deg)`,
          transition: 'transform 0.5s ease-out'
        }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '40px',
            height: '40px',
            transform: `rotate(${qible}deg) translateY(-60px) translate(-80%, -80%)`,
            transformOrigin: 'center'
          }}>
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: [0.7, 1.5, 0.7], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(0,255,4,0.4)',
              zIndex: 0
            }}></motion.div>
          <img
            src="/assets/kaaba.png"
            alt="Kaaba Icon"
            style={{
              width: '40px',
              height: '40px',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              transformOrigin: 'center',
              transition: 'transform 0.5s ease-out',
              zIndex: 1
            }}
          />
        </div>
      </div>
    </>
  )
}
