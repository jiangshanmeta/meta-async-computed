<template>
    <section>
        <table>
            <tr>
                <th>id</th>
                <td>{{id}}</td>
            </tr>
            <tr>
                <th>userName</th>
                <td>{{userName}}</td>
            </tr>
            <tr>
                <th>userPhone</th>
                <td>{{userPhone}}</td>
            </tr>
            <tr>
                <th>userMail</th>
                <td>{{userMail}}</td>
            </tr>
            <tr>
                <th>userInfo</th>
                <td>{{userInfo}}</td>
            </tr>
            <tr v-if="isShowLazy">
                <th>lazy</th>
                <td>{{lazy}}</td>
            </tr>
        </table>

        <button @click="increaseId">increase id</button>

        <button @click="showLazy">showLazy</button>
    </section>
</template>

<script>
export default{
    data(){
        return {
            id:null,
            counter:0,
            isShowLazy:false,
        };
    },
    computed:{
        userInfo:{
            get(){
                return `${this.userName} || ${this.userMail}`
            },
            // cache:false,
        }
    },
    asyncComputed:{
        userName(){
            return new Promise((resolve)=>{
                let id = this.id;
                console.log("getter for userName");
                setTimeout(()=>{
                    // console.log("resolved")
                    resolve(`name for ${id}`);
                },2000);
            });
        },
        userPhone:{
            get(){
                return new Promise((resolve)=>{
                    let id = this.id;
                    console.log("getter for userPhone");
                    setTimeout(()=>{

                        resolve(`phone for ${id}`);
                    },2000)
                })
            },
            default:"loading phone ~~~"
        },
        userMail:{
            get(){
                return new Promise((resolve)=>{
                    let id = this.id;
                    console.log("getter for userMail")
                    setTimeout(()=>{
                        
                        resolve(`mail for ${id} and counter is ${this.counter}`)
                    },2000);
                })
            },
            watch(){
                return this.counter;
            },
            default(){
                return `loading mail for ${this.id} with counter is ${this.counter}`
            },
        },
        lazy:{
            lazy:true,
            get(){
                console.log("getter for lazy")
                let rst = `info that fetch lazy ${this.counter}`
                return rst;
            },
            watch(){
                return this.counter;
            },
            default:"loading lazy",
        }

    },
    methods:{
        increaseId(){
            this.id++;
        },
        showLazy(){
            this.isShowLazy = true;
        }
    },
    created(){
        this.id = 1;
        setInterval(()=>{
            this.counter++;
        },5000)
    }
}
</script>