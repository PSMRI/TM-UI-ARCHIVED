/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/


import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../app-modules/core/services";
import { ConfirmationService } from "../app-modules/core/services/confirmation.service";

@Component({
  selector: "ResetComponent",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent {
  questionId: any = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {}

  public response: any;
  public error: any;
  showQuestions: boolean = false;
  hideOnGettingQuestions: boolean = true;
  securityQuestions: any;
  answer: any = null;
  userFinalAnswers: any[] = [];

  dynamictype: any = "password";

  public questions: any[] = [];
  public correctAnswers: any[] = [];
  public userAnswers: any[] = [];

  wrong_answer_msg: any = "";

  getQuestions(username: any) {
    localStorage.setItem("userName", username);
    this.authService.getUserSecurityQuestionsAnswer(username).subscribe(
      (response: any) => {
        if (response !== undefined && response !== null) {
          this.handleSuccess(response.data);
        } else {
          this.confirmationService.alert(response.errorMessage);
        }
      },
      (error: any) => (this.error = <any>error)
    );
  }

  handleSuccess(data: any) {
		console.log(data);
		if (data !== undefined && data.forgetPassword !== "user Not Found") {
			if (data.SecurityQuesAns.length > 0) {
				this.securityQuestions = data.SecurityQuesAns;
				this.showQuestions = true;
				this.hideOnGettingQuestions = false;

				this.splitQuestionAndQuestionID();
			}
			else {
				this.router.navigate(["/"]);
				this.confirmationService.alert("Questions are not set for this user");
			}
		}
		else {
			this.router.navigate(["/"]);
			this.confirmationService.alert("User not found");
		}
	}

	showPWD() {
		this.dynamictype = 'text';
	}

	hidePWD() {
		this.dynamictype = 'password';
	}
/*
 * Split the questions according to the questionId
 */

	splitQuestionAndQuestionID() {
		console.log('Q n A', this.securityQuestions);
		for (var i = 0; i < this.securityQuestions.length; i++) {
			this.questions.push(this.securityQuestions[i].question);
			this.questionId.push(this.securityQuestions[i].questionId);
		}
		console.log('questions', this.questions);
		console.log('questionID', this.questionId);
		this.showMyQuestion();
	}

	bufferQuestionId: any;
	bufferQuestion: any;
	counter: number = 0;

	showMyQuestion() {
		this.bufferQuestion = this.questions[this.counter];
		this.bufferQuestionId = this.questionId[this.counter];
	}

	nextQuestion() {
		if (this.counter < 3) {
			let reqObj = {
				"questionId": this.questionId[this.counter],
				"answer": this.answer,
			}
			this.userFinalAnswers.push(reqObj);
			this.wrong_answer_msg = "";
			this.counter = this.counter + 1;
			if (this.counter < 3) {
				this.showMyQuestion();
				this.answer = null;
			}
			else {
				this.validatingAnswers();
			}
		}
		console.log('user Final Answers are:', this.userFinalAnswers);	
	}
	// For validating final answers, If all answers are correct need to pass transaction ID
	validatingAnswers() {
		this.authService.validateSecurityQuestionAndAnswer(this.userFinalAnswers, localStorage.getItem('userName')).
			subscribe((response: any) => {
				if (response.statusCode == 200) {
					this.counter = 0;
					this.router.navigate(['/set-password']);
					this.authService.transactionId = response.data.transactionId;
				}
				else {
					this.getQuestions(localStorage.getItem('userName'));
          this.onFailureNavigateToResetPassword(response);
				}
			},
				(error: any) => {
          this.onFailureNavigateToResetPassword(error);
				}
			);
		this.answer = null;
		this.userFinalAnswers = [];
	}
  onFailureNavigateToResetPassword(error) {
    this.showQuestions = true;
    this.counter = 0;
    this.confirmationService.alert(error.errorMessage, "error");
    this.router.navigate(["/reset-password"]);
    this.splitQuestionAndQuestionID();
    }
	
}
