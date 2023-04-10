import React, { useEffect, useState } from "react";
import MentorNavBar from "../Mentor/NavBarMentor";
import "./stylesMentor.css"

const MentorHome = () => {
    console.log("MENTOR HOME---------------------------------")

return (

<>
    <MentorNavBar />
    
    <div className="maincontainer">
        <h1>Mentor Homepage</h1>
        <div className="mainrow">
            <div className="maincol1">
                
                <div className="assessmentsSection">
                    <h2>Mentor Homepage</h2>
                    <ul>
                        <li className="takeAssess">
                            <a href="/mentorTable">Table</a>
                        </li>
                        <li className="viewAssess">
                            <a href="/login">Logout</a>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </div>

    </>

    );
};
export default MentorHome;