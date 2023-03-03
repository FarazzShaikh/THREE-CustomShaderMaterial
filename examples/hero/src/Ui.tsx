import { Logo } from '@pmndrs/branding'
import { useFrame } from '@react-three/fiber'
import { forwardRef, useRef } from 'react'
import { FaGithub } from 'react-icons/fa'

export const Ui = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <>
      <div className="fps" ref={ref}>
        fps:
      </div>

      <div className="my-tag">
        <span>
          <a target="_blank" href="https://github.com/pmndrs/lamina">
            <Logo width={24} height={24} />
          </a>
        </span>

        <span>
          Made with 🧡 by{' '}
          <a target="_blank" href="https://twitter.com/CantBeFaraz">
            Faraz Shaikh
          </a>
        </span>

        <span>
          <a target="_blank" href="https://github.com/FarazzShaikh">
            <FaGithub size={24} />
          </a>
        </span>
      </div>
    </>
  )
})
