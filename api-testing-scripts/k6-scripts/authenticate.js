import {authenticate, refreshAuthentication} from './utils.js'

export default function() {
    const tokens = authenticate('marin', 'Password123!')

    console.log(tokens)

    const newToken = refreshAuthentication(tokens.refresh)

    console.log(newToken)
}