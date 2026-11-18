import axios from "axios";

let apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;

export const getProducts = async () => {
  console.log(`Fetching from: ${apiBaseUrl}web/home/product`);
  
  try {
    const res = await axios.get(`${apiBaseUrl}web/home/product`);
    return res.data; 
  } catch (error) {
    console.error("❌ API Fetch Error:", error.message);
    
    return { status: false, path: "", data: [], message: "Failed" }; 
  }
}
 export const getSlider=async()=>{
    try {
    const res = await axios.get(`${apiBaseUrl}web/home/slider`);
    return res.data; 
  } catch (error) {
    console.error("❌ API Fetch Error:", error.message);
    
    return { status: false, path: "", data: [], message: "Failed" }; 
  }
}
 export const getTestimonial=async()=>{
    console.log(`Fetching from: ${apiBaseUrl}web/home/testimonial`);
    try {
    const res = await axios.get(`${apiBaseUrl}web/home/testimonial`);
    return res.data; 
  } catch (error) {
    console.error("❌ API Fetch Error:", error.message);
    
    return { status: false, path: "", data: [], message: "Failed" }; 
  }
}
