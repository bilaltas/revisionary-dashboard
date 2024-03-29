<template>
	<div id="top-bar">
		<div class="left-side">
			<nuxt-link class="logo" to="/projects/">
				<Logo />
			</nuxt-link>

			<JumpTo v-if="authenticated" />

			<div class="info">
				<details>
					<summary class="button-circle transparent">
						<iIcon />
					</summary>
					<div class="details-menu center">
						<ul class="menu boxed compact lines">
							<li>
								<span
									style="display: grid; grid-auto-flow: row; align-items: flex-start; gap: 5px; color: black;"
								>
									<p>
										<b>Page URL:</b>
										<br />
										{{ deviceInfo.page_url }}
									</p>

									<p>
										<b>Date Created:</b>
										{{ $timeSince(deviceInfo.page_created) }}
									</p>

									<p>
										<b>Last Updated:</b>
										{{ $timeSince(deviceInfo.page_modified) }}
									</p>

									<p>
										<b>Current Frame Scale:</b>
										{{ $store.state.revise.iframeScale.toFixed(2) }}
									</p>
								</span>
							</li>
							<li>
								<span>
									<div class="left">
										<span>
											<DownloadIcon style="height: 14px;" />
											<span>Redownload This Phase</span>
										</span>
									</div>
									<div class="right"></div>
								</span>
							</li>
							<li>
								<span>
									<div class="left">
										<span>
											<CircleArrowDownIcon style="height: 14px;" />
											<span>Redownload For JS Site</span>
										</span>
									</div>
									<div class="right"></div>
								</span>
							</li>
							<li>
								<span>
									<div class="left">
										<span>
											<CaptureIcon style="height: 14px;" />
											<span>Site Capture Mode</span>
										</span>
									</div>
									<div class="right"></div>
								</span>
							</li>
							<li>
								<span>
									<div class="left">
										<span>
											<PlusIcon />
											<span>Integrations</span>
										</span>
									</div>
									<div class="right"></div>
								</span>
							</li>
						</ul>
					</div>
				</details>
			</div>
		</div>

		<div class="center-side">
			<div
				class="tasks tooltip-not-contained bottom-tooltip"
				data-tooltip="Open Tasks Panel"
				@click="$store.commit('toggleTab', 'tasks')"
				:class="{ active: $store.state.openTab == 'tasks' }"
			>
				<div
					class="tasks-count"
					v-if="deviceInfo.incomplete_tasks > 0 || deviceInfo.complete_tasks > 0"
				>
					<div class="left" v-if="deviceInfo.incomplete_tasks > 0">{{ deviceInfo.incomplete_tasks }}</div>
					<div class="done" v-if="deviceInfo.complete_tasks > 0">{{ deviceInfo.complete_tasks }}</div>
				</div>
				<div v-else>
					<small>No Tasks</small>
				</div>
			</div>

			<div class="versions">
				<details>
					<summary>
						<div class="selectbox light" @click="getPhases(deviceInfo.page_ID)">
							<VersionIcon />
							<span>v{{ deviceInfo.versions.findIndex(version => version.ID == deviceInfo.phase_ID) + 1 }}</span>
							<CaretDownIcon />
						</div>
					</summary>
					<div class="details-menu">
						<ul class="menu boxed compact lines">
							<li v-if="phasesFetching">
								<span>Loading...</span>
							</li>
							<li
								v-else
								v-for="(phase, index) in phases"
								:key="phase.ID"
								:class="{ active: phase.ID == deviceInfo.phase_ID }"
							>
								<span>
									<div class="left" @click="getDevices(phase.ID)">
										<TasksStatus
											:incompletedCount="phase.incomplete_tasks"
											:completedCount="phase.complete_tasks"
										/>
										<span>
											<VersionIcon />
											v{{ index + 1 }} ({{$timeSince(phase.created)}} ago)
											<CaretDownIcon class="show-on-hover" />
										</span>
									</div>
									<div class="right">
										<a
											href="#"
											class="show-on-hover tooltip-not-contained"
											data-tooltip="Delete this Phase"
										>&times;</a>
									</div>
								</span>
								<ul
									class="menu sub3"
									v-if="devices.filter(device => device.phase_ID == phase.ID).length || devicesFetching == phase.ID"
								>
									<li v-if="devicesFetching == phase.ID">
										<span>Loading...</span>
									</li>
									<li
										v-for="device in devices.filter(device => device.phase_ID == phase.ID)"
										:key="device.ID"
									>
										<span>
											<div class="left">
												<TasksStatus
													:incompletedCount="device.incomplete_tasks"
													:completedCount="device.complete_tasks"
												/>
												<nuxt-link :to="'/revise/' + device.ID">
													<WindowIcon v-if="device.cat_ID == 5" />
													<DesktopIcon v-if="device.cat_ID == 1" />
													<LaptopIcon v-if="device.cat_ID == 2" />
													<TabletIcon v-if="device.cat_ID == 3" />
													<MobileIcon v-if="device.cat_ID == 4" />
													<span>{{device.cat_name}} ({{ device.width ? device.screen_width : device.screen_width }}x{{ device.height ? device.height: device.screen_height }})</span>
												</nuxt-link>
											</div>
											<div class="right"></div>
										</span>
									</li>
								</ul>
							</li>
							<li class="add-new">
								<span>
									<div class="left">
										<span>
											<PlusIcon />
											<span>Add New Phase</span>
										</span>
									</div>
									<div class="right"></div>
								</span>
							</li>
						</ul>
					</div>
				</details>
			</div>

			<div class="screens">
				<details>
					<summary>
						<div class="selectbox light" @click="getDevices(deviceInfo.phase_ID)">
							<WindowIcon v-if="deviceInfo.cat_ID == 5" />
							<DesktopIcon v-if="deviceInfo.cat_ID == 1" />
							<LaptopIcon v-if="deviceInfo.cat_ID == 2" />
							<TabletIcon v-if="deviceInfo.cat_ID == 3" />
							<MobileIcon v-if="deviceInfo.cat_ID == 4" />
							<span>{{ deviceInfo.cat_name }}</span>
							<CaretDownIcon />
						</div>
					</summary>
					<div class="details-menu">
						<ul class="menu boxed compact lines">
							<li v-if="devicesFetching">
								<span>Loading...</span>
							</li>
							<li
								v-else
								v-for="device in devices"
								:key="device.ID"
								:class="{ active: device.ID == deviceInfo.ID }"
							>
								<span>
									<div class="left">
										<TasksStatus
											:incompletedCount="device.incomplete_tasks"
											:completedCount="device.complete_tasks"
										/>
										<nuxt-link :to="'/revise/' + device.ID">
											<WindowIcon v-if="device.cat_ID == 5" />
											<DesktopIcon v-if="device.cat_ID == 1" />
											<LaptopIcon v-if="device.cat_ID == 2" />
											<TabletIcon v-if="device.cat_ID == 3" />
											<MobileIcon v-if="device.cat_ID == 4" />
											<span>{{device.cat_name}} ({{ device.width ? device.width : device.screen_width }}x{{ device.height ? device.height: device.screen_height }})</span>
										</nuxt-link>
									</div>
									<div class="right">
										<a
											href="#"
											class="show-on-hover tooltip-not-contained"
											data-tooltip="Delete this screen"
										>&times;</a>
									</div>
								</span>
							</li>
							<li class="add-new" v-if="!devicesFetching">
								<span>
									<div class="left">
										<TasksStatus :incompletedCount="0" :completedCount="0" />
										<span>
											<PlusIcon />
											<span>Add New Screen</span>
										</span>
									</div>
									<div class="right">
										<ChevronRightIcon class="show-on-hover" />
									</div>
								</span>
							</li>
						</ul>
					</div>
				</details>
			</div>

			<div class="switch pin-modes">
				<span
					class="bottom-tooltip tooltip-not-contained browse"
					:class="{ active: currentPinType == 'browse' }"
					data-tooltip="Browse Mode"
					@click="changePinMode('browse')"
				>
					<BrowseIcon />
				</span>
				<span
					class="bottom-tooltip tooltip-not-contained comment"
					:class="{ active: currentPinType == 'comment' }"
					data-tooltip="Comment Mode"
					@click="changePinMode('comment')"
				>
					<CommentIcon />
				</span>
				<span
					class="bottom-tooltip tooltip-not-contained content"
					:class="{ active: currentPinType == 'content' }"
					data-tooltip="Content Mode"
					@click="changePinMode('content')"
				>
					<ContentIcon />
				</span>
				<span
					class="bottom-tooltip tooltip-not-contained style"
					:class="{ active: currentPinType == 'style' }"
					data-tooltip="Style Mode"
					@click="changePinMode('style')"
				>
					<StyleIcon />
				</span>
			</div>

			<div class="limitations" @click="$store.commit('toggleTab', 'usage')">27 Content Pins Left</div>
		</div>

		<div class="right-side">
			<div class="share button-circle">
				<ShareIcon />
			</div>

			<div
				class="notifications button-circle"
				@click="$store.commit('toggleTab', 'notifications')"
				:class="{ active: $store.state.openTab == 'notifications' }"
			>
				<NotificationIcon :count="$store.state.newNotificationsCount" />
			</div>

			<span class="separator"></span>

			<div class="profile">
				<details>
					<summary class="rotate-icon">
						<ProfilePic
							class="profile-pic"
							:firstName="currentUser.first_name"
							:lastName="currentUser.last_name"
							:email="currentUser.email"
							:picture="currentUser.picture"
						/>
						<ChevronDownIcon />
					</summary>
					<div class="details-menu right">
						<ul class="menu boxed">
							<li>
								<a href="#">Account</a>
							</li>
							<li>
								<a href="#">Help</a>
							</li>
							<li>
								<a href="#">Feedback</a>
							</li>
							<li>
								<a href="#" @click.prevent="logout">Logout</a>
							</li>
						</ul>
					</div>
				</details>
			</div>
		</div>
	</div>
</template>

<script>
	import Logo from "~/components/atoms/Logo.vue";
	import JumpTo from "~/components/molecules/JumpTo.vue";
	import Limitations from "~/components/organisms/Limitations.vue";
	import ProfilePic from "~/components/atoms/ProfilePic.vue";

	import MenuIcon from "~/components/atoms/icon-menu.vue";
	import ShareIcon from "~/components/atoms/icon-share.vue";
	import NotificationIcon from "~/components/atoms/icon-notification.vue";
	import iIcon from "~/components/atoms/svg/icon-i.svg";
	import DownloadIcon from "~/components/atoms/svg/icon-download.svg";
	import CircleArrowDownIcon from "~/components/atoms/svg/icon-circle-arrow-down.svg";
	import CaptureIcon from "~/components/atoms/svg/icon-capture.svg";

	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";
	import ChevronRightIcon from "~/components/atoms/icon-chevron-right.vue";
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";
	import CaretRightIcon from "~/components/atoms/icon-caret-right.vue";

	import PlusIcon from "~/components/atoms/icon-plus.vue";
	import VersionIcon from "~/components/atoms/icon-version.vue";

	import WindowIcon from "~/components/atoms/devices/icon-custom.vue";
	import DesktopIcon from "~/components/atoms/devices/icon-desktop.vue";
	import LaptopIcon from "~/components/atoms/devices/icon-laptop.vue";
	import TabletIcon from "~/components/atoms/devices/icon-tablet.vue";
	import MobileIcon from "~/components/atoms/devices/icon-mobile.vue";

	import BrowseIcon from "~/components/atoms/pin-modes/icon-browse.svg";
	import CommentIcon from "~/components/atoms/pin-modes/icon-comment.svg";
	import ContentIcon from "~/components/atoms/pin-modes/icon-text.svg";
	import StyleIcon from "~/components/atoms/pin-modes/icon-visual.svg";

	import TasksStatus from "~/components/atoms/tasks-status.vue";

	export default {
		components: {
			Logo,
			JumpTo,
			Limitations,
			MenuIcon,
			ShareIcon,
			NotificationIcon,
			iIcon,
			DownloadIcon,
			CircleArrowDownIcon,
			CaptureIcon,
			ProfilePic,
			ChevronDownIcon,
			ChevronRightIcon,
			CaretDownIcon,
			CaretRightIcon,
			PlusIcon,
			VersionIcon,
			WindowIcon,
			DesktopIcon,
			LaptopIcon,
			TabletIcon,
			MobileIcon,
			BrowseIcon,
			CommentIcon,
			ContentIcon,
			StyleIcon,
			TasksStatus,
		},
		props: {
			type: {
				default: "dashboard",
			},
		},
		data() {
			return {
				devices: [],
				devicesFetching: false,
				phases: [],
				phasesFetching: false,
			};
		},
		created() {
			if (!this.$auth.loggedIn) this.$store.commit("toggleSideBar", false);
		},
		computed: {
			authenticated() {
				return this.$auth.loggedIn;
			},
			currentUser() {
				return this.$auth.user;
			},
			isSideBarOpen() {
				return this.$store.state.isSideBarOpen;
			},
			deviceInfo() {
				return this.$store.state.revise.device;
			},
			currentPinType() {
				return this.$store.state.revise.currentPinType;
			},
		},
		methods: {
			changePinMode(type = "browse") {
				this.$store.commit("revise/setCurrentPinType", type);
			},
			async getDevices(phaseID) {
				this.$nuxt.$loading.start();
				this.devices = [];
				this.devicesFetching = phaseID;
				await this.$axios
					.get("phase/" + phaseID + "/devices")
					.then(({ status, data }) => {
						if (status === 200) {
							const devices = data.devices;
							console.log("DEVICES: ", devices);

							this.devices = devices;
							this.devicesFetching = false;
						}
					})
					.catch((error) => {
						console.log("ERROR: ", error);
						this.devicesFetching = false;
					});
			},
			async getPhases(pageID) {
				this.$nuxt.$loading.start();
				this.devices = [];
				this.phasesFetching = pageID;
				await this.$axios
					.get("page/" + pageID + "/phases")
					.then(({ status, data }) => {
						if (status === 200) {
							const phases = data.phases;
							console.log("PHASES of Page #" + pageID, phases);
							this.phases = phases;
							this.phasesFetching = false;
						}
					})
					.catch((error) => {
						console.log("ERROR: ", error);
						this.phasesFetching = false;
					});
			},
		},
	};
</script>

<style lang="scss">
	#top-bar {
		background-color: #010e28;
		display: grid;
		grid-auto-flow: column;
		gap: 24px;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		width: 100%;
		height: 60px;
		color: #9ea5ab;

		& > * {
			display: inherit;
			grid-auto-flow: inherit;
			gap: 15px;
			justify-content: inherit;
			align-items: inherit;
		}

		svg {
			display: block;
		}

		.button-circle {
			width: 30px;
			height: 30px;
			background-color: rgba(255, 255, 255, 0.1);
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;

			& > svg,
			& > * > svg {
				width: 12px;

				& > path {
					stroke: white;
				}
			}

			&.transparent {
				background-color: transparent;
				border: 1px solid rgba(255, 255, 255, 0.26);
			}

			&.info {
				summary {
					width: 30px;
					height: 30px;
					display: flex;
					justify-content: center;
					align-items: center;

					svg {
						margin-top: -2px;
						margin-right: -1px;
					}
				}
			}

			&.share {
				background-color: #74b65c;

				& > svg {
					height: 13px;
				}
			}

			&.active,
			&:hover {
				background-color: $color-primary;
			}
		}

		.separator {
			background-color: rgba(255, 255, 255, 0.15);
			width: 1px;
			height: 35px;
		}

		#jump-to {
			summary {
				& > svg.chevron-down {
					& > path {
						stroke: white;
					}
				}
			}
		}

		.limitations {
			font-weight: 600;
			font-size: 13px;
			line-height: normal;
			color: white;
			text-transform: none;
			display: inherit;
			grid-auto-flow: inherit;
			gap: inherit;
			justify-content: inherit;
			align-items: inherit;
			border-bottom: 1px dashed;
			cursor: pointer;

			&:hover {
				border-color: $color-primary;
			}
		}

		.profile {
			summary {
				display: grid;
				grid-auto-flow: column;
				align-items: center;
				justify-content: center;
				gap: 10px;
			}

			.rotate-icon {
				svg > path {
					stroke: #727781;
				}
			}
		}

		.selectbox,
		.switch {
			height: 30px;
		}

		.pin-modes {
			& > .comment.active {
				background-color: $color-comment;
			}
			& > .content.active {
				background-color: $color-content;
			}
			& > .style.active {
				background-color: $color-style;
			}
		}

		.tasks {
			background-color: rgba(255, 255, 255, 0.1);
			padding: 0 9px;
			border-radius: 3px;
			cursor: pointer;
			display: inherit;
			grid-auto-flow: inherit;
			gap: inherit;
			justify-content: inherit;
			align-items: inherit;

			.tasks-count {
				& > * {
					border-color: #2a2d30;
					font-weight: 700;

					&.done {
						//background-color: #79838c;
					}
				}
			}

			&.active,
			&:hover {
				background-color: $color-primary;

				.tasks-count {
					& > * {
						border-color: transparent;
					}
				}
			}
		}

		.menu-icon {
			cursor: pointer;
			user-select: none;

			&.active {
				svg > rect:first-child {
					fill: $color-primary;
				}
			}
		}

		& > .center-side {
			background-color: rgba(255, 255, 255, 0.1);
			padding: 6px 27px;
			border-radius: 12px;

			& > * {
				height: 30px;
			}

			.selectbox {
				color: white;

				& > svg.caret-down {
					& > path {
						fill: white;
					}
				}

				& > svg:not(.caret-down) path {
					stroke: white;
				}
			}
		}
	}
</style>
