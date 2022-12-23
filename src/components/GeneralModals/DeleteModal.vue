<template>
	<v-dialog v-model="deleteDialog" persistent width="400">
		<v-card id="deleteDialog">
			<div class="con">
				<h2>{{ title }}</h2>
				<div class="details">
					{{ message }}
				</div>
				<div class="btnsCon">
					<v-btn text color="#4b5a76" @click="cancel" id="cancelBtn"
						>Cancel</v-btn
					>
					<v-btn color="error" @click="deleteConfirmed" id="deleteBtn" :loading="loading"
						>Delete</v-btn
					>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: { loading:Boolean,deleteDialog: Boolean, message: String, title: String },
		data() {
			return {};
		},
		methods: {
			cancel() {
				this.$emit("cancelDelete");
			},
			deleteConfirmed() {
				this.$emit("deleteConfirmed");
			},
		},
	};
</script>

<style scoped>
	.con {
		padding: 30px;

		color: #4b5a76;
	}

	.details {
		font-size: 16px;
		padding: 20px 0px;
	}

	.btnsCon {
		display: flex;
		justify-content: flex-end;
	}

	@media only screen and (max-width: 650px) {
		.con {
			padding: 20px;
		}

		h2 {
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
