<template>
    <v-container fluid>
        <v-row justify="center" align="center" class="bg-image">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-card-title class="text-center">
                        <h1 class="display-3 font-weight-bold">GOFIT GYM</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="login">
                            <v-text-field v-model="formUser.id_user" label="User ID" outlined
                                prepend-icon="mdi-account-outline" required></v-text-field>
                            <v-text-field v-model="formUser.password" label="Password" outlined
                                prepend-icon="mdi-lock-outline" type="password" required></v-text-field>
                            <v-checkbox v-model="remember" label="Remember me" hide-details></v-checkbox>
                            <v-btn type="submit" class="mx-auto d-block" color="primary" large depressed @click="login">
                                Login
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import store from '../store/index.js'
export default {
    data() {
        return {
            formUser: {
                id_user: "",
                password: "",
            },
            remember: false,
            id: null,
            dataDashboad: null,
            dataInfo: null,
            dataPromo:null,
            dataKelas: null,
        }
    },
    methods: {
        async login() {
            const response = await axios.post(store.state.domainName + 'login', this.formUser)
                .then(async (response) => {
                    if (response.data.data.role == 'admin') {
                        this.id = response.data.data.id_user
                        this.dataDashboad = await axios.get(store.state.domainName + 'pegawai/' + this.id)
                        this.dataInfo = await axios.get(store.state.domainName + 'getuser/' + this.id)
                        this.dataPromo = await axios.get(store.state.domainName + 'promo')
                        toastr.success('Login Success as admin')
                        store.commit('setDataUser', this.dataDashboad.data)
                        store.commit('setLoginInfo', this.dataInfo.data)
                        store.commit('setDataPromo', this.dataPromo.data)
                        this.$router.push('/admin/adminDashboard')
                    } else if (response.data.data.role == 'manager operasional') {
                        this.id = response.data.data.id_user
                        toastr.success('Login Success as Manager Operasional')
                        this.dataKelas = await axios.get(store.state.domainName + 'kelas')
                        this.dataDashboad = await axios.get(store.state.domainName + 'pegawai/' + this.id)
                        this.dataInfo = await axios.get(store.state.domainName + 'getuser/' + this.id)
                        store.commit('setDataUser', this.dataDashboad.data)
                        store.commit('setLoginInfo', this.dataInfo.data)
                        store.commit('setDataKelas', this.dataKelas.data)
                        this.$router.push('/mo/moDashboard')
                    } else if (response.data.data.role == 'kasir') {
                        this.id = response.data.data.id_user
                        toastr.success('Login Success as kasir')
                        this.dataDashboad = await axios.get(store.state.domainName + 'pegawai/' + this.id)
                        this.dataInfo = await axios.get(store.state.domainName + 'getuser/' + this.id)
                        const dataMember = await axios.get(store.state.domainName + 'member')
                        store.commit('setDataUser', this.dataDashboad.data)
                        store.commit('setLoginInfo', this.dataInfo.data)
                        store.commit('setDataMember', dataMember.data)
                        this.$router.push('/kasir/kasirDashboard')
                    }else{
                        toastr.error('Login Failed')
                    }
                }).catch((err) => {
                    toastr.error('Login Failed')
                })
        },
    },
}
</script>

<style>
.bg-image {
    background-image: url('../assets/1633729.jpg');
    background-size: cover;
    background-position: center center;
    height: 100vh;
}

</style>
