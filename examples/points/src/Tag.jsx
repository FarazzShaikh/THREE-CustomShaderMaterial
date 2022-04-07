import { FaGithub, FaTwitter } from 'react-icons/fa'

export default function Tag() {
  return (
    <div className="copy">
      <span>
        <a target="_blank" href="https://twitter.com/CantBeFaraz">
          <FaTwitter size={40} />
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
          <FaGithub size={40} />
        </a>
      </span>
    </div>
  )
}
