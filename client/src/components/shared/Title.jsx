import { Helmet } from "react-helmet-async";
// eslint-disable-next-line react/prop-types
const Title = ({ti="Chat" , description="this is the chat app"}) => {
  return (
    <Helmet>
        <title>{ti}</title>
        <meta name="description" content={description}/>
    </Helmet>
  )
}

export default Title