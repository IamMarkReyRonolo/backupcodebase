<template>
	<div class="loginStaff">
		<v-alert
			outlined
			type="warning"
			v-if="token_expired"
			dismissible
			class="mx-auto my-5"
			width="300px"
			>{{ message }}</v-alert
		>
		<div class="wrapperDiv">
			<div class="rightCon">
				<div class="imgCon"><img src="../../assets/illu.png" alt="" /></div>
				<div class="innerWrap2">
					<div class="largeLogoCon">
						<div class="largeMath">Math</div>
						<div class="largeWorld">World</div>
					</div>

					<div class="details">
						<div class="detail">
							<span style="font-weight: 500"
								>Providing Math Practice Questions For</span
							>
						</div>
					</div>

					<div class="subDetails">
						<ul>
							<li>Scholastic Aptitude Test (SAT)</li>
							<li>American College Testing (ACT)</li>
							<li>Texas Success Initiative (TSI)</li>
							<li>State of Texas Assessments of Academic Readiness (STAAR)</li>
							<li>MathWorld Custom Questions</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="leftCon">
				<div class="innerWrap">
					<div class="headerSection">
						<div class="logoSection" id="logo">
							<span style="font-weight: 500">Math</span
							><span style="color: black">World</span>
						</div>
						<div class="fieldLabel">Admin/Staff Login</div>
					</div>
					<br />
					<div class="fieldsSection">
						<div class="field">
							<div class="fieldLabel">Email *</div>
							<v-text-field
								filled
								dense
								id="email"
								v-model="user.email"
								:rules="usernameRules"
							></v-text-field>
						</div>

						<div class="field">
							<div class="fieldLabel">Password *</div>
							<v-text-field
								filled
								dense
								id="password"
								v-model="user.password"
								:rules="passwordRules"
								:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
								:type="show ? 'text' : 'password'"
								@click:append="show = !show"
							></v-text-field>
						</div>
					</div>
					<br />
					<div class="ctrlSection">
						<v-btn
							color="#5D6A84"
							:dark="validated"
							:disabled="!validated"
							@click="handleLoginEvent()"
							:loading="adminStore.loading"
							id="logInBtn"
							>Log In</v-btn
						>
					</div>
				</div>
			</div>
		</div>

		<Snackbar
			:snackbar="snackbar"
			:message="message"
			:status="status"
			@closeSnackbar="snackbar = false"
			v-if="snackbar"
		/>
	</div>
</template>

<script>
	import Snackbar from "../../components/GeneralModals/Snackbar.vue";
	import { useAdminAuthStore } from "../../store/AdminAuth";
	export default {
		components: { Snackbar },
		props: {
			expired_token: {
				type: Boolean,
			},
		},
		created() {
			if (this.$route.params.expired_token) {
				this.token_expired = this.$route.params.expired_token;
				this.message = "Token Expired";
			}
			try {
				const token = JSON.parse(localStorage.getItem("token"));
				if (token) {
					this.$router.push("/staff");
				}
			} catch (error) {
				localStorage.removeItem("token");
			}
		},

		data: () => ({
			adminStore: useAdminAuthStore(),
			user: {
				email: "",
				password: "",
			},
			token_expired: false,
			show: false,
			snackbar: false,
			status: null,
			message: "",
			usernameRules: [
				(v) => !!v.trim() || "This field is required",
				(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email must be valid",
			],
			passwordRules: [(v) => !!v || "This field is required"],
		}),

		methods: {
			async handleLoginEvent() {
				await this.adminStore.logIn(this.user);
				if (this.adminStore.error) {
					if (this.adminStore.error.message == "Network Error") {
						this.message = this.adminStore.error.message;
					} else {
						this.message = "Incorrect Credentials";
					}
					this.status = "Error";
					this.snackbar = true;
				} else {
					this.$router.push("/staff");
				}
			},
		},
		computed: {
			validated: function () {
				if (this.user.email.trim() == "" || this.user.password.trim() == "") {
					return false;
				}
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
					return false;
				}
				return true;
			},
		},
	};
</script>

<style scoped>
	.wrapperDiv {
		color: #5a6781;
		padding: 20px 50px;
		margin: auto;
		margin-top: 120px;
		display: flex;
	}

	.leftCon {
		width: 40%;
		height: 400px;
	}

	.rightCon {
		width: 60%;
		height: 400px;
		border-right: 2px solid #b9b9b9;
	}

	.leftCon {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* left Con */

	.innerWrap {
		margin-top: -40px;
	}

	.logoSection {
		font-size: 30px;
	}

	.field {
		width: 400px;
		margin-bottom: 10px;
		color: #4f5d79;
	}

	.fieldLabel {
		padding-bottom: 10px;
		font-weight: normal;
		font-size: 14px;
	}

	.v-text-field {
		font-size: 18px;
	}

	/* right con */

	.rightCon {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.imgCon img {
		width: 250px;
	}

	.innerWrap2 {
		padding: 20px 40px;
	}

	.largeLogoCon {
		font-size: 70px;
		margin-top: 50px;
		display: flex;
	}

	.largeMath {
		font-weight: 500;
	}

	.largeWorld {
		color: rgba(0, 0, 0, 0.2);
	}

	.largeMath,
	.largeWorld {
		margin-top: -100px;
	}

	.details {
		font-size: 18px;
		margin-top: -20px;
		display: flex;

		padding: 0px;
	}

	.detail {
		padding: 10px;
	}

	.subDetails {
		font-size: 14px;
	}

	@media only screen and (max-width: 1200px) {
		.wrapperDiv {
			padding: 20px 20px;
		}
		/* left Con */

		.logoSection {
			font-size: 24px;
		}

		.field {
			width: 300px;
		}

		.fieldLabel {
			font-size: 12px;
		}

		.v-text-field {
			font-size: 16px;
		}

		/* right Con */

		.imgCon img {
			width: 200px;
		}

		.innerWrap2 {
			padding: 20px 20px;
		}

		.largeLogoCon {
			font-size: 50px;
			margin-top: 50px;
			display: flex;
		}

		.details {
			font-size: 16px;
			margin-top: -20px;
			display: flex;

			padding: 0px;
		}

		.subDetails {
			font-size: 12px;
		}
	}

	@media only screen and (max-width: 900px) {
		.wrapperDiv {
			display: flex;
			flex-direction: column-reverse;
			justify-content: center;
			align-items: center;
		}

		.rightCon {
			border: none;
			margin-top: 40px;
			padding-top: 10px;
			border-top: 2px solid #b9b9b9;
		}
	}

	@media only screen and (max-width: 600px) {
		.imgCon img {
			display: none;
		}
	}
</style>
