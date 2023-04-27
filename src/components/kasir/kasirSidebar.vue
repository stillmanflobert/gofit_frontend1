<template>
    <div class="dashboard">
        <v-navigation-drawer class="fullheight" width="256" v-model="drawer" absolute expand-on-hover>
            <v-list>
                <v-list-item class="px-2">
                    <v-list-item-avatar>
                        <v-img src="https://randomuser.me/api/portraits/women/85.jpg" :clickable="true"
                            @click="dialog = true"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-title class="text-h6" :style="{ 'text-align': 'left' }">
                        GOFIT GYM
                    </v-list-item-title>
                </v-list-item>

                <v-list-item link>
                    <v-list-item-content :style="{ 'text-align': 'left' }">
                        <v-list-item-title class="text-h6">
                            {{ name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list nav dense>
                <v-list-item v-for="item in items" :key="item.title" link color="light-blue darken-4" tag="router-link"
                    :to="item.to">
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title :style="{ 'text-align': 'left' }">{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-footer absolute>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="text-center">
                            <v-btn block color="light-blue" dark @click="logout">
                                <v-icon left>mdi-logout</v-icon>
                                Logout
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-footer>
        </v-navigation-drawer>
        <div class="fullheight pa-5">
            <router-view></router-view>
        </div>
        <v-dialog v-model="dialog" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Change Your Password</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model="user.newPassword" label="New Password" required></v-text-field>
                        <v-text-field v-model="user.confirmPassword" label="Confirm New Password" required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="cancelFunction">Cancel</v-btn>
                    <v-btn color="red" text @click="changePassword">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog2" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Your New Password is Not Valid</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="dialog2 = false">Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog3" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Your Confirm Password is Not Valid</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="dialog3 = false">Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog4" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Please Fill Password and Confirm Password</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="dialog4 = false">Ok</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import store from '@/store/index';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import router from '@/router';
export default {
    name: "DashboardIndex",
    data() {
        return {
            drawer: null,
            group: null,
            dialog: false,
            dialog2: false,
            dialog3: false,
            dialog4: false,
            name: store.state.dataUser.data.NAMA_PEGAWAI,
            email: store.state.dataUser.data.EMAIL,
            newDataUser: null,
            items: [
                { title: "Member", to: "/kasir/kasirDashboard", icon: 'mdi-folder' },
            ],
            user: {
                newPassword: '',
                confirmPassword: ''
            }
        };
    },
    methods: {
        async changePassword() {
            if (this.user.newPassword == '' || this.user.confirmPassword == '') {
                this.dialog4 = true
            } else if (this.user.confirmPassword != this.user.newPassword) {
                this.dialog3 = true
            } else if(this.user.newPassword == store.state.loginInfo.data.password){
                this.dialog2 = true
            }else {
                const response = await axios.post(store.state.domainName + 'change-password/', {
                    id_user: store.state.loginInfo.data.id_user,
                    password: store.state.loginInfo.data.password,
                    new_password: this.user.newPassword
                }).then(async (response) => {
                    this.newDataUser = await axios.get(store.state.domainName + 'getuser/' + store.state.loginInfo.data.id_user)
                    toastr.success('Password Successfully Changed')
                }).catch((err) => {
                    toastr.error('Password Failed to Change')
                })
                store.commit('setLoginInfo', this.newDataUser.data)
                this.dialog = false
                this.resetForm()
            }
        },
        resetForm() {
            this.user.newPassword = ''
            this.user.confirmPassword = ''
        },
        cancelFunction() {
            this.resetForm()
            this.dialog = false
        },
        logout(){
            store.commit('setLoginInfo', null)
            store.commit('setDataUser', null)
            router.push('/')
            toastr.success('Logout Success')
        }
    },
};
</script>

<style scoped>
.fullheight {
    min-height: 100vh !important;
}
</style>
