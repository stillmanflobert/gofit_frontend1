<template>
    <v-main class="container">
        <div>
            <v-card class="pa-8 gym-bg" width="1700">
                <h1 class="text-h3 text-center white--text font-weight-bold">Welcome, {{ nama }} </h1>
            </v-card>
            <v-spacer style="height: 30px;"></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide details></v-text-field>
            <v-btn class="mx-2" fab dark color="indigo" @click="addFuntion">
                <v-icon dark>
                    mdi-account-plus
                </v-icon>
            </v-btn>
            <v-spacer style="height: 20px;"></v-spacer>
            <!-- <v-data-table :headers="headers" :items="dataKels" :search="search">
                <template v-slot:item="{ item }">
                    <tr @click="dialogProcess(item.ID_KELAS); formProcess(item);">
                        <td>{{ item.ID_KELAS }}</td>
                        <td>{{ item.NAMA_KELAS }}</td>
                        <td>{{ item.HARGA_KELAS}}</td>
                    </tr>
                </template>
            </v-data-table> -->
            <v-card class="mx-auto" max-width="344">
    <v-row no-gutters>
      <v-col cols="4">
        <v-img :src="imageSrc" aspect-ratio="1"></v-img>
      </v-col>
      <v-col cols="8">
        <v-card-title>aa</v-card-title>
        <v-card-subtitle>aa</v-card-subtitle>
        <v-card-text>aa</v-card-text>
      </v-col>
    </v-row>
  </v-card>
        </div>
    </v-main>
</template>

<script>
import store from '@/store/index'
import axios from 'axios';
    export default{
        data(){
            return{
                nama: store.state.dataUser.data.NAMA_PEGAWAI,
                headers:[
                    {text: 'Id Kelas', value: 'ID_KELAS'},
                    {text: 'Nama Kelas', value: 'NAMA_KELAS'},
                    {text:'Harga Kelas', value: 'HARGA_KELAS'},
                ],
                dataKels: store.state.dataKelas.data,
                search: '',
                imageSrc: 'https://img-cdn.medkomtek.com/IL0eBVzHLNLbCy3ZfjjIKYi8eM8=/730x411/smart/filters:quality(75):strip_icc():format(webp)/article/EFTZmCwEkiBqMWeMi3yqN/original/1668121488-Manfaat%20Muay%20Thai.jpg'
            }
        },
        mounted(){
            setInterval(async() => {
                const up = await axios.get(store.state.domainName + 'kelas')
                store.commit('setDataKelas', up.data)
            }, 20000);
        }
    }
</script>
<style scoped>
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

td {
    text-align: left;
}
.card__wrapper {
  max-width: 400px;
}
</style>

