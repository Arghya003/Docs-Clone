
import {Box} from "@mui/material"
import { useEffect } from 'react'
import Quill from "quill"
import toolbarOptions from "../assets/contants"
import  "quill/dist/quill.snow.css"
const Editor = () => {
  useEffect(()=>{
    const QuillServer=new Quill("#container",{theme:"snow", modules:{toolbar:toolbarOptions}})
  },[])
  return (
    <Box sx={{bgcolor:"#f5f5f5"}} >
      <Box className="container" id="container"></Box>

    </Box>
   
  )
}

export default Editor
