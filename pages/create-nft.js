import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreateItem() {
  const [image, setImage] = useState({imageData:'', imagePreviewUrl: '', imageIpfsUrl: ''})
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  function createObjectURL(obj) {
    let url = null;
    if (window.createObjectURL != undefined) {
      url = window.createObjectURL(obj);
    } else if (window.URL != undefined) {
      url = window.URL.createObjectURL(obj);
    } else if (window.webkitURL != undefined) {
      url = window.webkitURL.createObjectURL(obj);
    }
    return url;
  }

  async function handleSelectedFile(e) {
    const file = e.target.files[0]
    const dataUrl = createObjectURL(file); 
    try {
      setImage({imageData: file, imagePreviewUrl: dataUrl, imageIpfsUrl: ''})
    } catch (error) {
      console.log('Error uploading file: ', error)
    } 
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !image.imagePreviewUrl) {
      window.alert("form error"); return
    }
    // 1 - upload picture
    let pic_url = '#';
    try {
      const pic = await client.add(image.imageData);
      pic_url = `https://ipfs.infura.io/ipfs/${pic.path}`
      console.log("[ipfs]image upload url:", pic_url)
    } catch (err) {
      console.log("[ipfs failed] upload image failed");
      console.log(err)
    }
    // 2 - upload json
    try {
      const meta_data = JSON.stringify({ name, description, image: pic_url })
      const meta = await client.add(meta_data)
      const url = `https://ipfs.infura.io/ipfs/${meta.path}`
      return url
    } catch (err) {
      console.log("[ipfs failed] upload metadata failed");
      console.log(err)
    }  
  }
  // 挂单
  async function listNFTForSale() {
    let url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={handleSelectedFile}
        />
        {
          image?.imagePreviewUrl && (
            <img className="rounded mt-4" width="350" src={image?.imagePreviewUrl} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">创造数字资产</button>
      </div>
    </div>
  )
}