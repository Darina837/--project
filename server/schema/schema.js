const graphql = require('graphql');
const gql = require('graphql');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');
const {validateRegisterInput} = require('./validation');

const SECRET_KEY = 'some secret key';

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLFloat, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLInputObjectType } = graphql;

const Goods = require('../models/good');
const Categories = require('../models/category');
const Images = require('../models/image');
const Users = require('../models/user');
const Managers = require('../models/manager');
const Consultants = require('../models/consultant');
const Orders = require('../models/order');



const ImageType = new GraphQLObjectType({
    name: 'Image',
    fields: () => ({
        _id: { type: GraphQLID },
        text: { type: new GraphQLNonNull(GraphQLString) },
        url: { type: new GraphQLNonNull(GraphQLString) },
        good: {
            type: GoodType,
            resolve({_idGood}, args) {
                return Goods.findById(_idGood)
            }
        }
    })
});

const GoodType = new GraphQLObjectType({
    name: 'Good',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        metal: { type: new GraphQLNonNull(GraphQLString) },
        insertion: { type: new GraphQLNonNull(GraphQLString) },
        campaign: { type: new GraphQLNonNull(GraphQLString) },
        theme: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        size: {type: GraphQLList(GraphQLString)},
        category: {
            type: CategoryType,
            resolve({_idCategory}, args) {
                return Categories.findById(_idCategory)
            }
        },
        image: {
            type: GraphQLList(ImageType),
            resolve({_id}, args) {
                return Images.find({ _idGood: _id })
            }
        },
        order: {
            type: GraphQLList(OrderType),
            resolve({_id}, args) {
                return Orders.find({ _idGood: _id })
            }
        }
    })
});

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        good: {
            type: GraphQLList(GoodType),
            resolve({_id}, args) {
                return Goods.find({ _idCategory: _id })
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLID },
        login: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString },
        telephone: { type: GraphQLString },
        order: {
            type: GraphQLList(OrderType),
            resolve({_id}, args) {
                return Orders.find({_idUser: _id})
            }
        }
    })
});

const ManagerType = new GraphQLObjectType({
    name: 'Manager',
    fields: () => ({
        _id: { type: GraphQLID },
        login: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString }
    })
});

const ConsultantType = new GraphQLObjectType({
    name: 'Consultant',
    fields: () => ({
        _id: { type: GraphQLID },
        login: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString },
        order: {
            type: GraphQLList(OrderType),
            resolve({_id}, args) {
                return Orders.find({ _idConsultant: _id })
            }
        }
    })
});

const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        _id: { type: GraphQLID },
        status: { type: GraphQLString },
        totalSum: { type: GraphQLFloat },
        consultant: {
            type: ConsultantType,
            resolve({_idConsultant}, args) {
                return Consultants.findById(_idConsultant)
            }
        },
        owner: {
            type: UserType,
            resolve({_idUser}, args) {
                return Users.findById(_idUser)
            }
        },
        good: {
            type: GraphQLList(GoodType),
            resolve({_idGood}, args) {
                return Goods.find({ _id: _idGood })
            }
        }
    })
});



const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        FindGood: {
            type: GoodType,
            args: { _id: { type: GraphQLID} },
            resolve(parent, {_id}) {
                return Goods.findById(_id)
            }
        },
        FindArrayGoods: {
            type: new GraphQLList(GoodType),
            args: { _id: { type: new GraphQLList(GraphQLID) } },
            resolve(parent, {_id}) {
                return Goods.find({_id})
            }
        },
        FindCategory: {
            type: CategoryType,
            args: { text: { type: GraphQLString } },
            resolve(parent, {text}) {
                return Categories.findOne({text})
            }
        },
        FindAllCategories: {
            type: new GraphQLList(CategoryType),
            resolve(parent, args) {
                return Categories.find({})
            }
        },
        FindAllGoods: {
            type: new GraphQLList(GoodType),
            resolve(parent, args) {
                return Goods.find({})
            }
        }, 
        FindUser: {
            type: UserType,
            args: { _id: { type: GraphQLID } },
            resolve(parent, {_id}) {
                return Users.findById(_id)
            }
        },
        FindConsultant: {
            type: ConsultantType,
            args: { _id: { type: GraphQLID } },
            resolve(parent, {_id}) {
                return Consultants.findById(_id)
            }
        },
        FindManager: {
            type: ManagerType,
            args: { _id: { type: GraphQLID } },
            resolve(parent, {_id}) {
                return Managers.findById(_id)
            }
        },
        FindAllUsers: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return Users.find({})
            }
        },
        FindAllOrders: {
            type: new GraphQLList(OrderType),
            resolve(parent, args) {
                return Orders.find({})
            }
        }
    }
});



const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        AddGood: {
            type: GoodType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                metal: { type: new GraphQLNonNull(GraphQLString) },
                insertion: { type: new GraphQLNonNull(GraphQLString) },
                campaign: { type: new GraphQLNonNull(GraphQLString) },
                theme: { type: new GraphQLNonNull(GraphQLString) },
                country: { type: new GraphQLNonNull(GraphQLString) },
                _idCategory: { type: GraphQLID },
            },
            resolve(parent, {name, price, metal, insertion, campaign, theme, country, _idCategory}) {
                const good = new Goods({
                    name,
                    price,
                    metal,
                    insertion,
                    campaign,
                    theme,
                    country,
                    _idCategory
                });
                return good.save();
            }
        },
        AddCategory: {
            type: CategoryType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                text: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, {name, text}) {
                const category = new Categories({
                    name,
                    text
                });
                return category.save();
            }
        },
        AddOrder: {
            type: OrderType,
            args: {
                goods: {type: new GraphQLList(GraphQLID)},
                _idUsr: {type: GraphQLID},
                prices: {type: new GraphQLList(GraphQLFloat)}
            },
            resolve(parent, {goods, _idUsr, prices}) {
                let total = 0;
                for(let i=0; i<prices.length; i++) {
                    total = total + Number(prices[i]);
                }
                
                const order = new Orders({
                    status: 'В обработке', 
                    _idGood: goods,
                    prices: prices,
                    totalSum: total,
                    _idUser: _idUsr
                });
                return order.save();
            }
        },
        AddImage: {
            type: ImageType,
            args: {
                _idGood: { type: GraphQLID },
                text: { type: new GraphQLNonNull(GraphQLString) },
                url: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, {_idGood, text, url}) {
                const img = new Images({
                    _idGood,
                    text,
                    url
                });
                return img.save();
            }
        },
        DeleteGood: {
            type: GoodType,
            args: { _id: { type: GraphQLID } },
            resolve(parent, {_id}) {
                return Goods.findByIdAndRemove(_id)
            }
        },
        DeleteCategory: {
            type: CategoryType,
            args: { _id: { type: GraphQLID } },
            resolve(parent, {_id}) {
                return Categories.findByIdAndRemove(_id)
            }
        },
        DeleteImage: {
            type: ImageType,
            args: { _id: { type: GraphQLID } },
            resolve(parent, {_id}) {
                return Images.findByIdAndRemove(_id)
            }
        },
        DeleteOrder: {
            type: OrderType,
            args: { _id: { type: GraphQLID } },
            resolve(parent, {_id}) {
                return Orders.findByIdAndRemove(_id)
            }
        },
        UpdatePriceGood: {
            type: GoodType,
            args: {
                _id: { type: GraphQLID },
                price: { type: GraphQLFloat }
            },
            resolve(parent, {_id, price}) {
                return Goods.findByIdAndUpdate(
                    _id,
                    {$set: {
                        price
                    } },
                    {new: true}
                )
            }
        },
        UpdateGood: {
            type: GoodType,
            args: {
                _id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                metal: { type: new GraphQLNonNull(GraphQLString) },
                insertion: { type: new GraphQLNonNull(GraphQLString) },
                campaign: { type: new GraphQLNonNull(GraphQLString) },
                theme: { type: new GraphQLNonNull(GraphQLString) },
                country: { type: new GraphQLNonNull(GraphQLString) },
                _idCategory: { type: GraphQLID }
            },
            resolve(parent, {_id, name, price, metal, insertion, campaign, theme, country, _idCategory}) {
                return Goods.findByIdAndUpdate(
                    _id,
                    { $set: { 
                        name, 
                        price, 
                        metal, 
                        insertion,
                        campaign,
                        theme,
                        country,
                        _idCategory  
                    } },
                    { new: true }
                )
            }
        },
        UpdateCategory: {
            type: CategoryType,
            args: {
                _id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                text: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, {_id, name, text}) {
                return Categories.findByIdAndUpdate(
                    _id,
                    { $set: { name, text } },
                    { new: true }
                )
            }
        },
        UpdateOrder: {
            type: OrderType,
            args: {
                _id: { type: GraphQLID },
                status: { type: GraphQLString }
            },
            resolve(parent, {_id, status}) {
                return Orders.findByIdAndUpdate(
                    _id,
                    { $set: { status } },
                    { new: true }
                )
            }
        },
        UpdateImage: {
            type: ImageType,
            args: {
                _id: { type: GraphQLID },
                _idGood: { type: GraphQLID },
                text: { type: new GraphQLNonNull(GraphQLString) },
                url: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, {_id, _idGood, text, url}) {
                return Images.findByIdAndUpdate(
                    _id,
                    { $set: {
                        _idGood,
                        text,
                        url 
                    } },
                    { new: true } 
                )
            }
        },
        RegistrationForUser: {
            type: UserType,
            args: {
                login: {type: GraphQLString}, 
                telephone: { type: GraphQLString },
                password: {type: GraphQLString},
                confirmPassword: {type: GraphQLString}
            },
            async resolve( parent, {login, telephone, password, confirmPassword}) {

                //валидные данные
                const { valid, errors } = validateRegisterInput(login, telephone, password, confirmPassword);
                if(!valid) {
                    throw new UserInputError('Errors', {errors});
                };
                
                //проверка на занятость логина
                const user = await Users.findOne({login});
                if(user) {
                    throw new UserInputError('Логин занят', {
                        errors: {
                            login: 'Этот логин уже занят'
                        }
                    })
                };

                hashPassword = bcrypt.hashSync(password, 12);
                const usr = new Users({
                    login,
                    password: hashPassword,
                    telephone
                });
                usr.save();
                return usr;
            }
        },
        LogInForUser: {
            type: UserType,
            args: {
                login: {type: GraphQLString}, 
                password: {type: GraphQLString}
            },
            async resolve( parent, {login, password}) {
                const user = await Users.findOne({login});
                if(user) {
                    const passwordResult = bcrypt.compareSync(password, user.password);
                    if(passwordResult) {
                        const token = jwt.sign({
                            _id: user._id,
                            login: user.login,
                        }, SECRET_KEY, {expiresIn: 60 * 60});
                        return {
                            _id: user._id,
                            token: token
                        }
                    }
                    else {
                        throw new UserInputError('InvalidPassword', {
                            errors: {
                                password: 'InvalidPassword'
                            }
                        })
                    }
                }
                else {
                    throw new UserInputError('InvalidLogin', {
                        errors: {
                            login: 'InvalidLogin'
                        }
                    })
                }
            }
        },
        LogInForConsultant: {
            type: ConsultantType,
            args: {
                login: {type: GraphQLString}, 
                password: {type: GraphQLString}
            },
            async resolve( parent, {login, password}) {
                const consultant = await Consultants.findOne({login});
                if(consultant) {
                    const passwordResult = bcrypt.compareSync(password, consultant.password);
                    if(passwordResult) {
                        const token = jwt.sign({
                            _id: consultant._id,
                            login: consultant.login,
                        }, SECRET_KEY, {expiresIn: 60 * 60});
                        return {
                            _id: consultant._id,
                            token: token
                        }
                    }
                //     else {
                //         throw new UserInputError('InvalidPassword', {
                //             errors: {
                //                 password: 'InvalidPassword'
                //             }
                //         })
                //     }
                // }
                // else {
                //     throw new UserInputError('InvalidLogin', {
                //         errors: {
                //             login: 'InvalidLogin'
                //         }
                //     })
                }
            }
        },
        LogInForManager: {
            type: ManagerType,
            args: {
                login: {type: GraphQLString}, 
                password: {type: GraphQLString}
            },
            async resolve( parent, {login, password}) {
                const manager = await Managers.findOne({login});
                if(manager) {
                    const passwordResult = bcrypt.compareSync(password, manager.password);
                    if(passwordResult) {
                        const token = jwt.sign({
                            _id: manager._id,
                            login: manager.login,
                        }, SECRET_KEY, {expiresIn: 60 * 60});
                        return {
                            _id: manager._id,
                            token: token
                        }
                    }
                //     else {
                //         throw new UserInputError('InvalidPassword', {
                //             errors: {
                //                 password: 'InvalidPassword'
                //             }
                //         })
                //     }
                // }
                // else {
                //     throw new UserInputError('InvalidLogin', {
                //         errors: {
                //             login: 'InvalidLogin'
                //         }
                //     })
                }
            }
        },
        RegistrationForConsultant: {
            type: ConsultantType,
            args: {
                login: {type: GraphQLString}, 
                password: {type: GraphQLString},
                confirmPassword: {type: GraphQLString}
            },
            async resolve( parent, {login, password, confirmPassword}) {

                hashPassword = bcrypt.hashSync(password, 12);
                const cons = new Consultants({
                    login,
                    password: hashPassword
                });
                cons.save();
                return cons;
            }
        },
        RegistrationForManager: {
            type: ManagerType,
            args: {
                login: {type: GraphQLString}, 
                password: {type: GraphQLString},
                confirmPassword: {type: GraphQLString}
            },
            async resolve( parent, {login, password, confirmPassword}) {

                hashPassword = bcrypt.hashSync(password, 12);
                const manag = new Managers({
                    login,
                    password: hashPassword
                });
                manag.save();
                return manag;
            }
        },
    }
});



module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})