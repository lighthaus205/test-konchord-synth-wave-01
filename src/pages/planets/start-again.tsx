import dynamic from 'next/dynamic'

const AndWeDanceHandInHandStemPlayer = dynamic(
  () => import("~/components/AndWeDanceHandInHandStemPlayer"),
  { ssr: false }
)


export default function StartAgain() {
  return <>
    <AndWeDanceHandInHandStemPlayer />
  </>;
}