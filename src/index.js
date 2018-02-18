function noop(){}

function generateGetter(key,fn){
    if(typeof fn === 'function'){
        return fn;
    }
    let getter = fn.get;
    if(fn.hasOwnProperty('watch')){
        getter = function(){
            fn.watch.call(this);
            return fn.get.call(this);
        }
    }

    if(fn.lazy){
        let nonLazy = getter;
        getter = function(){
            if(this[lazyActivePrefix + key]){
                return nonLazy.call(this);
            }else{
                return this[lazyDataPrefix + key];
            }
        };
    }

    return getter;
}




const lazyDataPrefix = 'async_computed$data$';
const lazyActivePrefix = 'async_computed$active$';

export default{
    install(Vue,pluginOptions={}){
        Vue.config.optionMergeStrategies.asyncComputed = Vue.config.optionMergeStrategies.computed;
        
        let pulginDefault = pluginOptions.hasOwnProperty('default')?pluginOptions.default:null;
        
        Vue.mixin({
            beforeCreate(){
                if(!this.$options.asyncComputed){
                    return;
                }

                const optionData = this.$options.data || {};

                this.$options.data = function(){
                    let data = typeof optionData === 'function'?optionData.call(this):optionData;

                    for(let key in this.$options.asyncComputed){

                        if(!this.$options.asyncComputed[key].lazy){
                            data[key] = null;
                        }else{
                            data[lazyDataPrefix + key] = null;
                            data[lazyActivePrefix + key] = false;

                            Object.defineProperty(this,key,{
                                get(){
                                    this[lazyActivePrefix + key] = true;
                                    return this[lazyDataPrefix + key];
                                },
                                set(val){
                                    this[lazyDataPrefix + key] = val; 
                                }
                            })

                        }
                    }

                    return data;
                }
            },
            created(){
                if(!this.$options.asyncComputed){
                    return;
                }
                
                for(let key in this.$options.asyncComputed){
                    let item = this.$options.asyncComputed[key];
                    let itemDefault = item.hasOwnProperty('default')?item.default:pulginDefault;
                    if(typeof itemDefault === 'function'){
                        itemDefault = itemDefault.call(this);
                    }

                    this[key] = itemDefault;

                    let promiseId = 0;

                    this.$watch(generateGetter(key,item),function(newPromise){
                        if(!(newPromise instanceof Promise)){
                            newPromise = Promise.resolve(newPromise);
                        }

                        const thisPromiseId = ++promiseId;

                        newPromise.then((value)=>{
                            if(thisPromiseId !== promiseId){
                                return;
                            }
                            this[key] = value;
                        }).catch((e)=>{
                            if(thisPromiseId !== promiseId){
                                return;
                            }

                            pluginOptions.errorHandler && pluginOptions.errorHandler.call(this,e);
                        })


                    },{
                        immediate:true,
                    });


                }
            },
        })


    },
}
