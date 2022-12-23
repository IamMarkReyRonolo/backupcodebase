<template>
	<v-dialog v-model="confirmSubmission" persistent width="400">
		<v-card>
			<div class="con">
				<div class="headerTitle" id="modalTitle" v-if="mode == 'create'">
					Create Question
				</div>
				<div class="headerTitle" id="modalTitle" v-if="mode == 'update'">
					Update Question
				</div>
				<br />
				<div class="details" v-if="mode == 'create'">
					By clicking the create button you confirm the creation of this
					question.
				</div>

				<div class="details" v-if="mode == 'update'">
					By clicking the update button you confirm to update this question.
				</div>
				<br />

				<div class="btnsCon">
					<v-btn
						text
						color="#4b5a76"
						@click="$emit('cancelSubmission')"
						id="cancelBtn"
					>
						Cancel</v-btn
					>
					<v-btn
						color="#4b5a76"
						dark
						@click="$emit('proceedSubmission')"
						id="proceedSubmitBtn"
					>
						<span v-if="mode == 'create'">Create</span>
						<span v-if="mode == 'update'">Update</span></v-btn
					>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: { confirmSubmission: Boolean, mode: String },
		data() {
			return {
				assignee: "",
			};
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
