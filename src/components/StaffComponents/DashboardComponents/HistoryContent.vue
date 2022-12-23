<template>
	<div class="contentCon">
		<div class="contentHeader">
			<div class="header1">Date</div>
			<div class="header2">Activity</div>
			<div class="header3">Details</div>
			<div class="header4">Staff</div>
		</div>

		<v-btn
			large
			block
			tile
			text
			class="dataCon"
			v-for="(data, n) in historyData"
			:key="n"
			@click="goTo(data.question_uuid)"
			:id="'selectActivityId' + data.id"
		>
			<span class="content contentData1">{{
				getLocalDate(data.created_at)
			}}</span
			><span class="content contentData2"
				><v-chip x-small color="#4B5A76" dark v-if="data.title == 'Create'">{{
					data.title
				}}</v-chip>
				<v-chip x-small color="warning" dark v-if="data.title == 'Update'">{{
					data.title
				}}</v-chip>
				<v-chip x-small color="error" dark v-if="data.title == 'Delete'">{{
					data.title
				}}</v-chip></span
			><span class="content contentData3">{{ data.details }}</span
			><span class="content contentData4">{{ data.staff_involved }}</span>
		</v-btn>
	</div>
</template>

<script>
	export default {
		props: {
			historyData: Array,
		},
		data: () => ({}),
		methods: {
			goTo(id) {

				id = id ? id : 'null'
				this.$router.push({
					name: "questions",
					path: "/staff/lists",
					query: { id: id },
				});
			},

			getLocalDate(date) {
				let utc_date = date + "Z";
				let local_date = new Date(utc_date);

				return local_date.toDateString();
			},
		},
	};
</script>

<style scoped>
	.contentCon {
		padding: 10px 0px;
	}

	.contentHeader {
		width: 100%;
		padding: 10px 10px;
		display: flex;
	}

	.header1,
	.header2,
	.header3,
	.header4 {
		color: #4c5b77;
		font-size: 12px;
	}

	.header1,
	.header2,
	.header4,
	.contentData1,
	.contentData2,
	.contentData4 {
		width: 20%;
		text-align: left;
	}

	.header3,
	.contentData3 {
		width: 40%;

		text-align: left;
	}

	.content {
		color: #4c5b77;
	}

	.dataCon {
		display: flex;
		justify-content: flex-start;
		font-size: 12px;
	}

	.v-btn:not(.v-btn--round).v-size--default {
		padding-left: 10px;
	}

	.contentData4 {
		padding: 0px 10px;
	}

	@media only screen and (max-width: 800px) {
		.header1,
		.header2,
		.header4,
		.contentData1,
		.contentData2,
		.contentData4 {
			width: 33%;
		}

		.header3,
		.contentData3 {
			display: none;
		}
	}

	@media only screen and (max-width: 650px) {
		.dataCon {
			font-size: 10px;
		}
	}

	@media only screen and (max-width: 450px) {
		.v-chip.v-size--x-small {
			border-radius: 8px;
			font-size: 8px;
			height: 14px;
		}
	}
</style>
