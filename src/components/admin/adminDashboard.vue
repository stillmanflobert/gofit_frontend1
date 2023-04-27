<template>
    <v-main class="container">
        <div>
            <v-card class="pa-8 gym-bg" width="1700">
                <h1 class="text-h3 text-center white--text font-weight-bold">Welcome,{{ nama }} </h1>
            </v-card>
        </div>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-btn class="mx-2" fab dark color="indigo" @click="addPromo">
            <v-icon dark>
                mdi-plus
            </v-icon>
        </v-btn>
        <v-spacer style="height: 20px;"></v-spacer>
        <v-row>
            <v-col v-for="promo in promos" :key="promo.ID_PROMO">
                <v-card class="mx-auto" max-width="400" outlined>
                    <v-img class="images" height="200"></v-img>
                    <v-card-title class="text-h5 mt-4 mb-0">
                        {{ promo.NAMA_PROMO }}
                    </v-card-title>
                    <v-card-text>
                        <p>{{ promo.DESKRIPSI_PROMO }}</p>
                        <p>Valid until {{ promo.WAKTU_SELESAI_PROMO }}</p>
                        <p>Hurry, offer ends soon!</p>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn color="error" text @click="deletePromo(promo.ID_PROMO)">Delete</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="updatePromo(promo)">Edit</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Are You Sure To Delete This Promo?</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="cancelFunction">NO</v-btn>
                    <v-btn color="red" text @click="deleteProcces">YES</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog2" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark v-show="updateTitle">Edit Promo</v-toolbar>
                    <v-toolbar color="red" dark v-show="addTitle">Add Promo</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model="formUpdate.namapromo" label="Promo Name" required></v-text-field>
                        <v-textarea v-model="formUpdate.dekripsi" label="Promo Description" required rows="2"></v-textarea>

                        <v-dialog v-model="modal" persistent width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="formUpdate.waktumulai" label="Start From" prepend-icon="mdi-calendar"
                                    v-on="on" required></v-text-field>
                            </template>
                            <v-date-picker v-model="formUpdate.waktumulai" scrollable required>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">
                                    Cancel
                                </v-btn>
                                <v-btn text color="primary" @click="modal = false">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <v-dialog v-model="modal2" persistent width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="formUpdate.waktuselesai" label="End At" prepend-icon="mdi-calendar"
                                    v-on="on" required></v-text-field>
                            </template>
                            <v-date-picker v-model="formUpdate.waktuselesai" scrollable required>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal2 = false">
                                    Cancel
                                </v-btn>
                                <v-btn text color="primary" @click="modal2 = false">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="cancelFuntionUpdate">Cancel</v-btn>
                    <v-btn color="red" text @click="updateProcess" v-show="updateButton">Save</v-btn>
                    <v-btn color="red" text @click="addPromoProcess" v-show="addShow">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>
<script>
import store from '@/store/index'
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import router from '@/router'
export default {
    data() {
        return {
            nama: store.state.dataUser.data.NAMA_PEGAWAI,
            promos: store.state.dataPromo.data,
            dialog: false,
            deleteId: null,
            updateId: null,
            deleteDataUpdate: null,
            updataDataUpdate: null,
            dialog2: false,
            updateButton: false,
            addShow: false,
            formUpdate: {
                namapromo: '',
                dekripsi: '',
                waktumulai: '',
                waktuselesai: '',
            },
            updateTitle: false,
            addTitle: false,
            modal: false,
            modal2: false,
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            onOne: null,
        }
    },
    methods: {
        deletePromo(id) {
            this.dialog = true
            this.deleteId = id
        },
        cancelFunction() {
            this.dialog = false
            this.deleteId = null
        },
        async deleteProcces() {
            const del = await axios.delete(store.state.domainName + 'promo/' + this.deleteId)
                .then(async (response) => {
                    toastr.success('Delete Promo Success')
                    this.dialog = false
                    this.deleteId = null
                    this.deleteDataUpdate = await axios.get(store.state.domainName + 'promo')
                }).catch((error) => {
                    toastr.error('Delete Promo Failed')
                    this.dialog = false
                    this.deleteId = null
                })
            console.log(this.deleteDataUpdate.data)
            if (this.deleteDataUpdate.data.success == true) {
                store.commit('setDataPromo', this.deleteDataUpdate.data)
                this.$router.go()
            }
        },
        updatePromo(promo) {
            this.dialog2 = true
            this.updateId = promo.ID_PROMO
            this.formUpdate.namapromo = promo.NAMA_PROMO
            this.formUpdate.dekripsi = promo.DESKRIPSI_PROMO
            this.formUpdate.waktumulai = promo.WAKTU_MULAI_PROMO
            this.formUpdate.waktuselesai = promo.WAKTU_SELESAI_PROMO
            this.updateTitle = true,
            this.addTitle = false
            this.updateButton = true
            this.addShow = false
        },
        cancelFuntionUpdate() {
            this.dialog2 = false
            this.updateId = null
        },
        updateProcess() {
            const data = {
                nama_promo: this.formUpdate.namapromo,
                deskripsi_promo: this.formUpdate.dekripsi,
                waktu_mulai_promo: this.formUpdate.waktumulai,
                waktu_selesai_promo: this.formUpdate.waktuselesai,
            }
            axios.put(store.state.domainName + 'promo/' + this.updateId, data)
                .then(async (response) => {
                    toastr.success('Update Promo Success')
                    this.dialog2 = false
                    this.updateId = null
                    const up = await axios.get(store.state.domainName + 'promo')
                    this.updataDataUpdate = await up
                    store.commit('setDataPromo', this.updataDataUpdate.data)
                    router.go()
                    this.clearForm()
                }).catch((error) => {
                    toastr.error('Update Promo Failed')
                    this.dialog2 = false
                    this.updateId = null
                    console.log(this.formUpdate)
                    console.log(error)
                })
            console.log(this.deleteDataUpdate.data)
        },
        clearForm() {
            this.formUpdate.namapromo = ''
            this.formUpdate.dekripsi = ''
            this.formUpdate.waktumulai = ''
            this.formUpdate.waktuselesai = ''
        },
        addPromo() {
            this.clearForm()
            this.dialog2 = true
            this.updateTitle = false,
            this.addTitle = true
            this.updateButton = false
            this.addShow = true
        },
        async addPromoProcess(){
            const data = {
                nama_promo: this.formUpdate.namapromo,
                deskripsi_promo: this.formUpdate.dekripsi,
                waktu_mulai_promo: this.formUpdate.waktumulai,
                waktu_selesai_promo: this.formUpdate.waktuselesai,
            }
            await axios.post(store.state.domainName + 'promo', data)
                .then(async (response) => {
                    toastr.success('Add Promo Success')
                    this.dialog2 = false
                    this.updateId = null
                    const up = await axios.get(store.state.domainName + 'promo')
                    this.updataDataUpdate = await up
                    store.commit('setDataPromo', this.updataDataUpdate.data)
                    router.go()
                    this.clearForm()
                }).catch((error) => {
                    toastr.error('Add Promo Failed')
                    this.dialog2 = false
                    this.updateId = null
                    console.log(this.formUpdate)
                    console.log(error)
                })
        }
    },
    async mounted() {
        const up = axios.get(store.state.domainName + 'promo')
        this.one = await up
        store.commit('setDataPromo', this.one.data)
    }
}
</script>

<style>
.gym-bg {
    background-image: url('@/assets/1087580.jpg');
    background-position: center;
    background-size: cover;
    width: 100%;
}

.container {
    align-items: center;
}

.images {
    background-image: url('@/assets/1633729.jpg');
    background-position: center;
    background-size: cover;
    width: 100%;
}

p {
    text-align: left;
}
</style>


