import '../styles/globals.css'
import Link from 'next/link'
import Image from 'next/image'
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">
          <Image src="/logo.png" width="140px" height="38px" style={{display: 'inline-block', marginRight: '20px'}} alt="logo"/>
          Metaverse Marketplace
        </p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">市场</a>
          </Link>
          <Link href="/create-nft">
            <a className="mr-6 text-pink-500">发布</a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-pink-500">看板</a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-pink-500">我的</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp