import { DefaultProvider, sha256, bsv, toByteString } from 'scrypt-ts'
import { Root } from '../contracts/root'
import { NeucronSigner } from 'neucron-signer'

const provider = new DefaultProvider({ network: bsv.Networks.mainnet })
const signer = new NeucronSigner(provider)

await signer.login('sales@timechainlabs.io', 'string')
await Root.loadArtifact()

export async function lock(amount: number, square: number) {
    
    const bigintSquare = BigInt(square)
    const instance = new Root(bigintSquare)
    await instance.connect(signer)

    const deployTx = await instance.deploy(amount)    
    return {instance, deployTx}
}

export async function unlock (instance: Root, root: number) {
    const bigintRoot = BigInt(root)
    // await new Promise((f) => setTimeout(f, 2000))
    const { tx: callTx } = await instance.methods.unlock(bigintRoot)

    return callTx.id
}

const { instance, deployTx } = await lock(1, 4)
console.log('smart lock deployed : https://whatsonchain.com/tx/' + deployTx.id)

const unlockid = await unlock(instance, 2)
console.log('contract unlocked successfully : https://whatsonchain.com/tx/' + unlockid)
