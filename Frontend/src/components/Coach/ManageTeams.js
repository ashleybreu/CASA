import React, { useState, useEffect } from "react";
import './ManageTeams.css'
import '../General/casa-table.css'
import AddStudent from "./AddStudent";
import MakeTeam from "./MakeTeam";
import { useNavigate } from "react-router-dom";
import {loginChecker} from "../General/LoginCheck";
import {FaArrowUp, FaArrowDown, FaGripLines} from "react-icons/fa";
import { formatTeamIDNumber } from "../General/formatTeamIDNumber";
import { formatTeamIDString } from "../General/formatTeamIDString";
import { validateTeamID } from "../General/validateTeamID";

/* 
The ManageTeams component has multiple functions.
    - Contains the table of all students assigned to a Coach
    - Has functionality for updating a student's information in DB
    - Contains the buttons for "Add Student, "Delete Student", and "Make Team"
*/

function ManageTeams(props) {
    const [coachUserID, setCoachUserID] = useState();
    const [coach, setCoach] = useState();
    const [students, setStudents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [updateDisplayName, setUpdateDisplayName] = useState("");
    const [displayEmail, setDisplayEmail] = useState("");
    const [updateGradLevel, setUpdateGradLevel] = useState("");
    const [gradeLevel, setGradeLevel] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [studentId, setStudentId] = useState("")
    const [updateTeamID, setUpdateTeamID] = useState("");
    //const currentStudentTeamID = currentStudentID ? formatTeamIDString(updateTeamID) : ""; // Add this line
    const [currentStudentTeamID, setCurrentStudentTeamID] = useState("");
    const [currentStudentID, setCurrentStudentID] = useState();

    const[enabledAddToTeam, setEnabledAddToTeam] = useState(false);

    const[enableMakeTeam, setEnableMakeTeam] = useState(false);

    //Sort
    const [sorted, setSorted] = useState({sorted: "id", reversed: "false"});
    //search
    const [searchPhrase, setSearchPhrase] = useState("");
    const [allUsersCopy, setAllUsersCopy] = useState([]);
    
    //gets coach object from DB based on the user's ID
    const getCoach = async(coachID) => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'id': coachID})
            }
            const response = await fetch('/api/coachSearch', requestOptions)
            const jsonData = await response.json()

            setCoach(jsonData)
        } catch (error) {
            //console.log(error)
        }
    }

    //gets all students assigned to the coach from DB
    const  getStudents = async (coachID) => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'userID': coachID})
            }
            const response = await fetch('/api/coach/get_coaches_students', requestOptions)
            const jsonData = await response.json()
            setStudents(jsonData);
            setAllUsersCopy(jsonData);
        } catch (error) {
           // console.log(error)
        }
    }

    //gets all teams objects from DB given a list of teamIDs
    const getTeams = async (inputTeams) => {
        var tempTeams = [];
        for(let i = 0; i < inputTeams.length; i++){
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                };
                const response = await fetch('/api/teamsearch/' + JSON.stringify(inputTeams[i]), requestOptions);
                const jsonData = await response.json();
                tempTeams.push(...jsonData);
            } catch (error) {
                //console.log("error in getTeams: ", error);
            }
        }
        setTeams(tempTeams);
    }

    //gets a team's name based on teamID
    const getTeamName = (teamID) => {
        var teamName = "";
        teams.map(team => {
            if(team.national_id == teamID) {
                teamName = team.name;
            }
        })
        return teamName;
    }

    //given new student info, updates the student in DB to reflect the new info
    const updateStudentAccount = async (currentStudentID, newDispName, newGradLevel, newTeamID) => {
        if(newGradLevel < 9 || newGradLevel > 12){
            alert("The grade level has been edited to be outside of the highschool range.")
        }
        else {
            var tmpData = {coachID: coachUserID, studentID: currentStudentID, studentDispName: newDispName, studentGradLevel: newGradLevel, studentTeamID: newTeamID}
            try {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(tmpData)
            };
            
            const response = await fetch('/api/team/update_student_info', requestOptions)
            const jsonData = await response.json()
            getStudents(coachUserID);

            } catch (error) {
                console.log("error error");
            }
        }
    }

    //removes a coach's ID from student's coachID field
    const removeStudent = async (studentID) => {
        var tmpData = {coachID: coachUserID, student_id: studentID}
        try {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(tmpData)
        };
        
        const response = await fetch('/api/coach/remove_coachid_from_student', requestOptions)
        const jsonData = await response.json()

        } catch (error) {
            //console.log(error);
        }
    }

    //updates state variables so the form fields contain the current selected student's info
    const fillDisplayInfo = (student) => {
        setCurrentStudentID(student._id);
        setUpdateDisplayName(student.displayname);
        setDisplayEmail(student.email);
        student.gradelevel ? setUpdateGradLevel(student.gradelevel) : setUpdateGradLevel("N/A");
        (student.team != -1) ? setUpdateTeamID(formatTeamIDString(student.team)): setUpdateTeamID("N/A");
    }

    //opens AddStudents component
    const addStudentButton = () => {
        setEnabledAddToTeam(true);
    }

    //closes AddStudents component and updates students from DB
    const closeAddStudent = () => {
        setEnabledAddToTeam(false);
        getStudents(coachUserID);
    }

    //opens MakeTeam component
    const makeTeamButton = () => {
        setEnableMakeTeam(true);
    }

    //closes MakeTeam component and updates coach info from DB
    const closeMakeTeam = async () => {
        setEnableMakeTeam(false);
        await getCoach(coachUserID);
    }

    //button to remove the current selected student from the coach's roster
    const deleteStudentButton = async () => {
        if(currentStudentID != undefined) {
            const confirmText = "Are you sure you want to delete the current selected student? \n(This does not delete their account, but removes them from your roster)";
            if(window.confirm(confirmText) == true) {
                await removeStudent(currentStudentID);
                getStudents(coachUserID);
            } else {
            }
        }
    }

    //gets coachID from local storage on page load
    useEffect(() => {
        setCoachUserID(localStorage.getItem("_id"));
    }, []) 

    //gets coach and all students from DB when coachID is updated
    useEffect(() => {
        if(coachUserID) {
            getCoach(coachUserID);
            getStudents(coachUserID);
        }
    }, [coachUserID]) 

    //when coach is updated, updates the teams from DB
    useEffect(() => {
        if(coach) {
            getTeams(coach.teams);
        }
    }, [coach])

    //submit functionality for React form. Updates student based on information from the form.
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validateTeamID(updateTeamID)) {
            const convertedIDNumber = formatTeamIDNumber(updateTeamID);
            updateStudentAccount(currentStudentID, updateDisplayName,updateGradLevel,convertedIDNumber);
        }
    }
    
    //sorts by student display name
    const sortByName = () => {
        setSorted({sorted: "name", reversed: !sorted.reversed});
        const usersCopy = [...students];
        usersCopy.sort((userA, userB) => {
            const nameA = userA.displayname;
            const nameB = userB.displayname;
            if (sorted.reversed) {
                return nameB.localeCompare(nameA);
            }
            return nameA.localeCompare(nameB);
        });
        setStudents(usersCopy); 
    }
    
    //sorts by student email
    const sortByEmail = () => {
        setSorted({sorted: "email", reversed: !sorted.reversed});
        const usersCopy = [...students];
        usersCopy.sort((userA, userB) => {
            const nameA = userA.email;
            const nameB = userB.email;
            if (sorted.reversed) {
                return nameB.localeCompare(nameA);
            }
            return nameA.localeCompare(nameB);
        });
        setStudents(usersCopy); 
    }

    
    //sorts by grade level
    const sortByGrade = () => {
        setSorted({sorted: "grade", reversed: !sorted.reversed});
        const usersCopy = [...students];
        usersCopy.sort((userA, userB) => {
            const nameA = String(userA.gradelevel);
            const nameB = String(userB.gradelevel);
            if (sorted.reversed) {
                return nameB.localeCompare(nameA);
            }
            return nameA.localeCompare(nameB);
        });
        setStudents(usersCopy); 
    }

    //sorts by team id
    const sortByTeamID = () => {
        setSorted({sorted: "teamID", reversed: !sorted.reversed});
        const usersCopy = [...students];
        usersCopy.sort((userA, userB) => {
            const nameA = String(userA.team);
            const nameB = String(userB.team);
            if (sorted.reversed) {
                return nameB.localeCompare(nameA);
            }
            return nameA.localeCompare(nameB);
        });
        setStudents(usersCopy); 
    }

    const groupedStudents = {};
        students.forEach(student => {
        if (!groupedStudents[student.team]) {
            groupedStudents[student.team] = [];
        }
        groupedStudents[student.team].push(student);
    });

    //shows the arrow direction of sort
    const renderArrow = () => {
        if (sorted.reversed){
            return <FaArrowDown/>;
        }
            return <FaArrowUp/>;
    }
    //when arrows are not in affect, shows neutral lines to display that you can switch the directions of these arrows
    const renderConst = () => {
        return <FaGripLines/>;
    }
    //const allUsersCopy = [...students];

    const search = async (e) => {

        const matchedUsers = students.filter((user) => {
            return user.displayname.toLowerCase().includes(e.target.value.toLowerCase());
        });
        if (e.target.value.length == 0) {
            setStudents(allUsersCopy);
            setSearchPhrase(e.target.value);
        }
        else {
            setStudents(matchedUsers);
            setSearchPhrase(e.target.value);
        }
    }

    const renderTeamTables = () => {

        const handleDragStart = (e, student) => {
            // Set the data being dragged (in this case, the student's ID)
            e.dataTransfer.setData("studentId", student._id);
            e.dataTransfer.setData("displayName", student.displayname);
            e.dataTransfer.setData("gradeLevel", student.gradelevel);
        };

        const getTeamName = (teamID) => {
            var teamName = "";
            teams.map(team => {
                if(team.national_id == teamID) {
                    teamName = team.name;
                }
            })
            return teamName;
        }

        const teamsWithStudents = Object.entries(groupedStudents).map(([teamID, teamStudents]) => ({
            teamID,
            teamName: getTeamName(teamID),
            students: teamStudents
        }));
    
        const teamsWithoutStudents = teams.filter(team => !groupedStudents[team.national_id]);
        
    
        const handleDragOver = (e) => {
            e.preventDefault();
        };
        
        const handleDragEnter = (e) => {
            e.preventDefault();
        };
        
        const handleDrop = async (e, currentStudentTeamID) => {
            e.preventDefault();
            setCurrentStudentTeamID(currentStudentTeamID);
            const studentId = e.dataTransfer.getData("studentId");
            const displayName = e.dataTransfer.getData("displayName");
            const gradeLevel = e.dataTransfer.getData("gradeLevel");
            setStudentId(studentId);
            setDisplayName(displayName);
            setGradeLevel(gradeLevel);
            console.log("drop time")
            console.log(studentId)
            console.log(displayName)
            console.log(gradeLevel)
        
            // Find the student object
            const updatedStudents = students.map(student => {
                if (student._id === studentId) {
                    setCurrentStudentID(student._id);
                    setUpdateDisplayName(student.displayname);
                    setDisplayEmail(student.email);
                    student.gradelevel ? setUpdateGradLevel(student.gradelevel) : setUpdateGradLevel("N/A");
                    (student.team != -1) ? setUpdateTeamID(currentStudentTeamID): setUpdateTeamID("N/A");
                    return { ...student, team: currentStudentTeamID };
                }
        
                return student;
            });
        
            // Update the state with the modified students array
            setStudents(updatedStudents);
        
            // Update the student's team in the database
            const convertedIDNumber1 = formatTeamIDString(currentStudentTeamID);
            if (validateTeamID(convertedIDNumber1)) {
                console.log("Team is valid here");
                const convertedIDNumber = currentStudentTeamID;
                console.log(convertedIDNumber);
                await updateStudentAccount(studentId, displayName, gradeLevel, convertedIDNumber);
            }
        
            // Set the updateTeamID state
            setUpdateTeamID(currentStudentTeamID);
        
            console.log(`Dropped student ${studentId} into team ${currentStudentTeamID}`);
        };

        const handleAlternateChange = async (e, studentID, teamID, isChecked) => {
            e.preventDefault();

            if(isChecked){
            // Prepare the data to send to the API endpoint
            const requestData = {
                team_id: teamID,
                student_id: studentID
            };
        
            try {
                // Make a POST request to the add_alternate endpoint
                const response = await fetch('/api/team/add_alternate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
        
                // Handle the response as needed
                const data = await response.json();
                // You can handle the response data here
            } catch (error) {
                console.error('Error occurred:', error);
            }
        } else {
            const requestData = {
                team_id: teamID,
                student_id: studentID
            };
        
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(requestData)
            };
            fetch('/api/team/remove_alternate', requestOptions).then(
                    res => res.text()).then(text => {
    
                  }
            );
        }

        };
    
    
        
        // Render tables for teams with students
        const tablesWithStudents = Object.entries(groupedStudents).map(([teamID, teamStudents]) => (
            <div key={teamID} className="right" onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDrop={(e) => handleDrop(e, teamID)}>
                <h3>{getTeamName(teamID)} ({formatTeamIDString(teamID)})</h3>
                <table style={{ color: '#fff' }}>
                    {/* Table headers */}
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Grade Level</th>
                            <th>Alternate</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: '#fff' }}>
                        {teamStudents.map((student, index) => (
                            <tr
                                key={student._id}
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, student)}
                                onClick={() => fillDisplayInfo(student)}
                                className={student._id === currentStudentID ? "selected-row" : ""}
                            >
                                <td className={student._id === currentStudentID ? "td-selected-student" : 'td-student'}>{student.displayname}</td>
                                <td className={student._id === currentStudentID ? "td-selected-student" : 'td-student'}>{student.email}</td>
                                <td className={student._id === currentStudentID ? "td-selected-student" : 'td-student'}>{student.gradelevel !== undefined ? student.gradelevel : "N/A"}</td>
                                <td className={student._id === currentStudentID ? "td-selected-student" : 'td-student'}>
                                    <div className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            handleAlternateChange(e, student._id, teamID, e.target.checked);
                                            //e.stopPropagation(); // Prevent click event propagation
                                            student.alternate=!student.alternate
                                        }}
                                        checked={student.alternate}
                                    />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ));
    
        // Render tables for teams without students
        const tablesWithoutStudents = teamsWithoutStudents.map(team => (
            //<div key={team.national_id} className="right">
            <div key={team.national_id} className="right" onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDrop={(e) => handleDrop(e, team.national_id)}>
                <h3>{team.name} ({formatTeamIDString(team.national_id)})</h3>
                <table>
                    <tbody>
                        <tr>
                            <td className={'td-even'}>No students assigned to this team.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ));
    
        return [...tablesWithStudents, ...tablesWithoutStudents];
    }
    
    
    
    

    if(props.enabled == true) {
        return (
            <div>
                <div className="left _form-group">
                <form className="form-container" onSubmit={handleSubmit}>
                        {/* React Form Inputs */}
                        <div>
                            <label htmlFor='name'>Name </label>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                value={updateDisplayName}
                                onChange={(e) => setUpdateDisplayName(e.target.value)}
                            />

                            <p className="label-style">Email (Not Editable)</p>
                            <p className="email-box">{displayEmail}</p>

                            <label htmlFor='grade'>Grade Level</label>
                            <input
                                type='number'
                                id='grade'
                                name='grade'
                                value={updateGradLevel}
                                onChange={(e) => setUpdateGradLevel(e.target.value)}
                            />

                            <label htmlFor='team'>Team National ID</label>
                            <input
                                type='text'
                                id='team'
                                name='team'
                                value={updateTeamID}
                                onChange={(e) => setUpdateTeamID(e.target.value)}
                            />
                            <div className="button-alignment">
                                <button className="casa-button" type="submit">Save Changes</button>
                                <button className="casa-button delete-button" type="button" onClick={deleteStudentButton}>Delete Student</button>

                            </div>
                        </div>
                    </form>

                    {/* Delete Button and Misc Components */}
                    <div>
                        <AddStudent enabled={enabledAddToTeam} closeForm={closeAddStudent}/>
                        <MakeTeam enabled={enableMakeTeam} closeForm={closeMakeTeam}/>
                    </div>
                </div>

                {/* Student Table */}
                <div>
                    <div>
                        
                    <input className="input"
                    type="text" 
                    placeholder="Search Table"
                    value={searchPhrase}
                    onChange={search}
                />
                        <button  className = 'casa-button' onClick={search}>
                            
                            Search
                        </button>
                        <table className="right"></table>
                        {renderTeamTables()}
                        <button className="casa-button" type="button" onClick={addStudentButton}>Add Student</button>
                            <button className="casa-button" type="button" onClick={makeTeamButton}>Create Team</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManageTeams;