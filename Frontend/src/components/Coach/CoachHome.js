// Here will be the mentor page with a decent layout and buttons to future pages.
import React from 'react';
//import Button from './MentorButton';
import '../Mentor/Button.css'
import '../Mentor/PageLayout.css'
import '../Coach/CoachProfile'
import '../Coach/CoachSeeStudentProfile'

import { useNavigate } from "react-router-dom";


function CoachHome() {

  let navigate = useNavigate();

  function teamsButton(){
      navigate('/ViewTeams', {replace: true})  
  }

  function coachProfile(){
    navigate('/profile', {replace: true})
  }
  
  //this doesn't work anymore since we removed the /teacher route
  function homeButton(){
    navigate('/teacher', {replace: true})
  }
  function coachTableButton(){
    navigate('/coachtable', {replace: true})
  }
  function coachSeeStudentProfile() {
    navigate('/coachSeeStudentProfile', { replace: true })
  }

  


return (
  <div>
    <div class="body"> 
        <h2> CASA for Coaches</h2>
        <div></div>
            <button onClick={homeButton}>
            Home
            </button>
            
            <div></div>

            <button onClick={teamsButton}>
            Team
            </button>

            <div></div>

            <button onClick={coachProfile}>
            Profile
            </button>

            <div></div>

            <button onClick={coachTableButton}>
            Table of Mentors
            </button>

            <button onClick={coachSeeStudentProfile}>
            Student Profile
            </button>


    </div>
  </div> 
  );
}
  
export default CoachHome;