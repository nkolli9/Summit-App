import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { verifyName } from '../Shared/Utils.js';
import DOB from '../Shared/DobInput';
import deleteUser from './DeleteUserVirtualController';

class DeleteUserContainer extends Component {
    // TODO:
    // Confirmation dialog
    constructor(props) {
        super(props);

        // states
        this.state = {
            firstName: '',
            lastName: '',
            dob: null,
            dobCompleted: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClientDOB = this.handleClientDOB.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.nameCheck = this.nameCheck.bind(this);
        this.onDeletedUser = this.onDeletedUser.bind(this);
    }

    handleChange (event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleClientDOB(clientDob) {
        this.setState({
            dob: clientDob,
            dobCompleted: true
        });
    }

    handleSubmit(event) {
        // prevent default operation
        event.preventDefault();

        // pop up confirmation
        const retVal = window.confirm("Do you want to continue?");

        // quit unintended operation
        if(!retVal) {
            return;
        }

        const validNameCheck = this.nameCheck(event);

        if(validNameCheck.validName === true){
            this.setState({ isNameValid: true});

            const payload = {
                firstName : validNameCheck.firstName,
                lastName  : validNameCheck.lastName,
                dob       : this.state.dob,
            };

            deleteUser(payload, this.onDeletedUser);
        }
        else{
            console.log('invalid');
            this.setState({ isNameValid: false });
            //Invalid Name - highlight field thats incorrect
        }
    }

    onDeletedUser(result) {
        if(result.error === 'none') {
            alert('Successfully deleted user');
        } else {
            alert('couldn\'t deleted user');
        }
    }

    nameCheck(form_data){
        //Check for invalid characters and remove whitespace
        var fName = verifyName(this.state.firstName);
        var lName = verifyName(this.state.lastName);

        if(fName === "" || lName === "") {
            return { validName: false };
        } else {
            return { firstName:fName, lastName:lName, validName: true };
        }
    }

    render() {
        return(
            <div className='Centralized-In-Block'>
                <form id='form1' onSubmit={this.handleSubmit}>
                    First Name:
                    <input name='firstName' type='text' value={this.state.firstName} onChange={this.handleChange} />
                    <br />

                    Last Name:
                    <input name='lastName' type='text' value={this.state.lastName} onChange={this.handleChange} />
                    <br />

                    Date of birth:
                    <DOB onValidDOB={this.handleClientDOB}/>
                    <br />

                    {this.state.dobCompleted &&
                    <Button
                        bsStyle='primary'
                        form='form1'
                        type='submit'
                    >
                        Delete User
                    </Button>
                    }
                </form>
            </div>
        );
    }
}

export default DeleteUserContainer;
