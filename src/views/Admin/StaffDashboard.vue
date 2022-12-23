<template>
	<div class="dashboard">
		{{ currentTime }}
		<div class="fetched">
			<div class="welcomeCon">
				<div class="greetingsCon">
					<span
						class="greetings"
						v-if="
							time.split(' ')[1] == 'PM' &&
							(parseInt(time.split(':')[0]) == 12 ||
								(parseInt(time.split(':')[0]) >= 1 &&
									parseInt(time.split(':')[0]) <= 4))
						"
						>Good Afternoon,</span
					>
					<span class="greetings" v-else-if="time.split(' ')[1] == 'PM'"
						>Good Evening,</span
					>
					<span class="greetings" v-else-if="time.split(' ')[1] == 'AM'"
						>Good Morning,</span
					>
					<div class="name">{{ user.first_name }} 👋</div>
				</div>

				<div class="datetimeCon">
					<div class="actualDateTime">
						<div class="timeCon">
							{{ time }}
						</div>
						<div class="dateCon">{{ currentDate }}</div>
					</div>
				</div>
			</div>

			<div class="historyCon">
				<History />
			</div>
		</div>
	</div>
</template>

<script>
	import History from "../../components/StaffComponents/DashboardComponents/History.vue";
	import { useAdminAuthStore } from "../../store/AdminAuth";
	export default {
		name: "dashboard",
		components: {
			History,
		},
		async created() {
			this.user = this.adminStore.user;
			this.getTime();
		},
		data: () => ({
			adminStore: useAdminAuthStore(),
			user: null,
			time: "",
			timerIsOn: false,
		}),
		methods: {
			getTime() {
				let date = new Date();
				let hh = date.getHours();
				let mm = date.getMinutes();
				let ss = date.getSeconds();
				let session = "AM";

				if (hh === 0) {
					hh = 12;
				} else {
					if (hh == 12) {
						session = "PM";
					} else if (hh > 12) {
						hh = hh - 12;
						session = "PM";
					}
				}

				hh = hh < 10 ? "0" + hh : hh;
				mm = mm < 10 ? "0" + mm : mm;
				ss = ss < 10 ? "0" + ss : ss;

				let time = hh + ":" + mm + ":" + ss + " " + session;

				this.time = time;
				this.timerIsOn = false;
			},
		},
		computed: {
			currentTime: function () {
				this.timerIsOn = true;
				if (this.timerIsOn) {
					setTimeout(() => {
						this.getTime();
					}, 1000);
				}
			},

			currentDate: function () {
				let today = new Date();
				today = today.toString().split(" ").splice(0, 4);
				return today[0] + " " + today[1] + " " + today[2] + " " + today[3];
			},
		},
	};
</script>

<style scoped>
	.dashboard {
		padding: 20px 40px;
		color: #4c5b77;
	}

	.loading {
		text-align: center;
		margin: 200px 0px;
	}

	.welcomeCon {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.greetingsCon {
		display: flex;
		font-size: 34px;
		padding: 30px 0px;
	}

	.name {
		font-weight: 500;
		padding: 0px 10px;
	}

	.actualDateTime {
		width: 230px;
		text-align: right;
	}

	.timeCon {
		font-size: 34px;
	}

	@media only screen and (max-width: 800px) {
		.actualDateTime {
			width: 150px;
		}

		.greetingsCon {
			font-size: 24px;
		}

		.timeCon {
			font-size: 24px;
		}

		.dateCon {
			font-size: 14px;
		}
	}

	@media only screen and (max-width: 650px) {
		.dashboard {
			color: #4c5b77;
			padding: 10px 10px;
		}
		.welcomeCon {
			display: block;

			text-align: left;
			padding: 10px;
		}

		.actualDateTime {
			display: flex;
			width: 220px;
			text-align: left;
		}

		.timeCon {
			font-size: 14px;
			padding-right: 10px;
		}

		.dateCon {
			font-size: 14px;
		}

		.greetingsCon {
			padding: 10px 0px;
			font-size: 24px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
	}

	@media only screen and (max-width: 450px) {
		.greetingsCon {
			padding: 10px 0px;
			font-size: 24px;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;
		}

		.greetings {
			margin-right: 5px;
		}

		.name {
			padding: 0px;
		}
	}
</style>
