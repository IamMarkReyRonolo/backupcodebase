<template>
	<v-dialog v-model="loadingDialog" persistent width="300">
		<v-card id="loadingDialog">
			<div class="con">
				<div class="loadingDiv">
					<v-progress-circular
						:size="50"
						color="#4B5A76"
						indeterminate
					></v-progress-circular>
				</div>
				<br />
				<div id="loadingIndicator">Processing</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: { loadingDialog: Boolean },
		data() {
			return {};
		},

		// watch: {
		// 	dialog(val) {
		// 		if (!val) return;

		// 		setTimeout(() => (this.dialog = false), 4000);
		// 	},
		// },
	};
</script>

<style scoped>
	.con {
		padding: 20px;
		text-align: center;
		color: #4b5a76;
	}
</style>
