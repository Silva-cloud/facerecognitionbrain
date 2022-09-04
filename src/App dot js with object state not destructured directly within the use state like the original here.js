import './App.css';
import React, { useState } from 'react';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Rank from './components/rank/Rank';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
const particlesOptions = {
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    collisions: {
                        enable: true,
                    },
                    move: {
                        directions: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 3,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 70,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 2 },
                    },
                },
                detectRetina: true,
            };

const USER_ID = 'silva';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '7378de56a36c4c0e86ee95835d4a5633';
const APP_ID = 'my-first-application';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';


const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };



const initialState = {
  input: "",
  imageURL:"",
  box:{},
  route:'signIn',
  isSignedIn:false,
  user:{
            id:'',
            name: '',
            email:'',
            entries:0,
            joined: ''
     }
};




function App() {
  const particlesInit = useCallback(async (engine) => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        await console.log(container);
    }, []);



     // const [input, setInput] = useState('');
     // const [imageURL, setImageUrl] = useState('');
     // const [box, setBox] = useState({});
     // const [route, setRoute] = useState('signIn');
     // const [isSignedIn, setIsSignedIn] = useState(false);
     // const [user, setUser] = useState({
     //        id:'',
     //        name: '',
     //        email:'',
     //        entries:0,
     //        joined: ''
     // });




    const [
    m,
    setState
    ] = useState(initialState);

    const clearState = () => {
    setState({ ...initialState });
    };







      // componentDidMount() {
        // fetch('http://localhost:3001/')
        // .then(resp=>resp.json())
        // .then(console.log)
      // }
      //he example above shows a classical approach to 
      //access componentDidMount().
      // Here’s an example with a functional component:

  //     React.useEffect(() => {
  //       fetch('http://localhost:3001/')
  //       .then(resp=>resp.json())
  //       .then(console.log)
  // }, []);


    const loadUser= (data)=>{
      const {id,name,email,entries,joined} = data;  
      setState((prevState) => ({ ...prevState, user:{
        id:id,
        name:name ,
        email:email,
        entries:entries,
        joined: joined
      }}));
      // setUser({
      //   id:id,
      //   name:name ,
      //   email:email,
      //   entries:entries,
      //   joined: joined
      // })
      console.log(m.user);  
    }


     let claculateFaceLocation = (data)=>{
      const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
      // console.log('clarifaiFace-->',clarifaiFace);
      const image= document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      // console.log(width,"   ",height);
      return{
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol:width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)

      }

     }

     let displayFaceBox=(box)=>{
      console.log(box);
      // setBox(box);
      setState((prevState) => ({ ...prevState, box: box }));
     }

      let onInputChange= (event)=>{
        // console.log(event.target.value);
        // setInput(event.target.value);
        setState((prevState) => ({ ...prevState, input: event.target.value }));
     };

//remeber to try to move everything to imagelinkform and see if it still works
      let onButtonSubmit = ()=>{
       // console.log('click');
       // setImageUrl(input);
       setState((prevState) => ({ ...prevState, imageURL: prevState.input }));

       let raw2=requestOptions.body;
       let rawNJ=JSON.parse(raw2);
       rawNJ.inputs[0].data.image.url=m.input;
       const newRaw= JSON.stringify(rawNJ);
       requestOptions.body=newRaw;
       // console.log(requestOptions.body);


        fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        // .then(response=> console.log(response))
        .then(response => response.text())
        .then(result => {
        const parsedResult=JSON.parse(result);
        // let  boundingBoxResult=parsedResult.outputs[0].data.regions[0].region_info.bounding_box;
          // console.log(boundingBoxResult);


        if(parsedResult){
            console.log('dddd  ',m.user.id);
            fetch('http://localhost:3001/image',{
               method: 'put',
               headers: {'Content-Type':'application/json'},
               body: JSON.stringify({
                id: m.user.id
               })
            })
            .then(resp => resp.json())
            .then(count =>{
                console.log('count-->',count);
                // setUser(Object.assign(user,{entries: count}));
                // Object.assign(user,{entries: count});
                // user.entries=count;




                // setUser(count);
                //instead of the above line:
                setState((prevState) => ({ ...prevState, user:count
                  }));




                console.log('user.entries-->',m.user.entries);
            });
        }


        displayFaceBox(claculateFaceLocation(parsedResult));


        // setBox(claculateFaceLocation(parsedResult));
        // console.log(box);
        })
        .catch(error => console.log('error', error));
     };



     let onRouteChange =(route)=>{
      if(route==='home')
            setState((prevState) => ({ ...prevState, isSignedIn: true }));
          // setIsSignedIn(true);
      else
        setState((prevState) => ({ ...prevState, isSignedIn: false }));
        // setIsSignedIn(false);

        setState((prevState) => ({ ...prevState, route: route }));
      // setRoute(route);
      
     }
  return (
    <div className="App">
      {/*<Particles id="tsparticles" url="http://foo.bar/particles.json" init={particlesInit} loaded={particlesLoaded} />*/}
      <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={particlesOptions}
        />
      <Navigation onRouteChange={onRouteChange} isSignedIn={m.isSignedIn}/>
      { m.route==='home'

        ?<div>
          <Logo />
          <Rank  name={m.user.name} entries={m.user.entries}/>
          <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
          <FaceRecognition box={m.box} imageURL={m.imageURL} />
        </div>
        
        :(

           m.route==='signIn'
           ?<SignIn onRouteChange={onRouteChange} loadUser={loadUser} />
           :<Register onRouteChange={onRouteChange} loadUser={loadUser} />

          )
      }
    </div>
  );
}

export default App;
