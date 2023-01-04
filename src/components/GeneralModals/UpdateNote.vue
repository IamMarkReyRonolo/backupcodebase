<template>
	<v-dialog v-model="proceedUpdate" persistent :max-width="600">
		<v-card>
			<div class="con">
				<div class="headerTitle" id="modalTitle">Update Question</div>

				<br />

				<v-textarea
					placeholder="Add Update Note"
					filled
					no-resize
					label="Add Update Note"
					counter="70"
					:rules="required"
					v-model="update_note"
				></v-textarea>

				<div class="btnsCon">
					<v-btn
						text
						color="#4b5a76"
						id="cancelBtn"
						@click="$emit('cancelUpdate')"
					>
						Cancel</v-btn
					>
					<v-btn
						color="#4b5a76"
						id="proceedSubmitBtn"
						:disabled="!isProceed"
						:dark="isProceed"
						@click="updateQuestion"
						:loading="loading"
					>
						<span>Update</span></v-btn
					>
				</div>
			</div>
		</v-card>

		<Snackbar
			:snackbar="snackbar"
			:message="message"
			:status="status"
			v-if="snackbar"
			@closeSnackbar="snackbar = false"
		/>
	</v-dialog>
</template>

<script>
	import { useQuestionStore } from "../../store/QuestionStore";
	import Snackbar from "./Snackbar.vue";
	export default {
		components: { Snackbar },
		props: { proceedUpdate: Boolean },
		data() {
			return {
				questionStore: useQuestionStore(),
				assignee: "",
				proceed: false,
				update_note: "",
				required: [
					(v) => !!v || "Required",
					(v) =>
						v ? v.length <= 70 || "Exceeded number of characters" : true || "",
				],
				loading: false,
				error: false,
				success: false,
				snackbar: false,
				message: "",
				status: "Error",
			};
		},

		methods: {
			async updateQuestion() {
				try {
					this.loading = true;
					await this.questionStore.updateQuestion();
					this.loading = false;
					this.questionStore.updateSuccess = true;
				} catch (error) {
					this.error = true;
					this.loading = false;
					this.message =
						"An error occured while updating question. Please try again.";
					this.snackbar = true;
				}
			},
		},

		computed: {
			isProceed: function () {
				if (this.update_note.length > 0 && this.update_note.length < 71) {
					return true;
				} else {
					return false;
				}
			},
		},
	};
</script>

<style scoped>
	.con {
		padding: 40px;
		text-align: left;
		color: #4b5a76;
	}

	.headerTitle {
		font-size: 24px;
		font-weight: bold;
	}

	.btnsCon {
		display: flex;
		justify-content: flex-end;
	}

	@media only screen and (max-width: 650px) {
		.con {
			padding: 20px;
		}

		.headerTitle {
			font-size: 16px;
		}

		.details {
			font-size: 12px;
			padding: 10px 0px;
		}

		.btnsCon .v-btn {
			font-size: 12px;
			height: 24px;
		}
	}
</style>
