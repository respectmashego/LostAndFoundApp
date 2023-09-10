import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { getItem, removeItem } from '../util/asyncStorage';
import Loader from '../components/Loader';
import axios from 'axios';
import Item from '../components/Item';

const LostFoundProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('PostedItems');
  const [loading, setLoading] = useState(false)
  const [userPostedItems, setUserPostedItems] = useState([])
  const [istherError, setIstheError] = useState(false)
  const dispatch = useDispatch()

  const fetchUserItems = async () => {
    setIstheError(false)
    setLoading(true)
    const token = await getItem("token")
    try {
      const response = await axios("http://192.168.74.44:3000/user/posted-items", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.status == 200) {

        const items = await response.data.userPostedItems
        console.log(items);
        setUserPostedItems(items)
        setIstheError(false)
      } else {
        console.error("error occured")
      }
    }
    catch (error) {
      console.error("error occured", error)
      setIstheError(true)
    }
    finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    fetchUserItems()

  }, [])

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };


  const handleLogout = async () => {
    try {
      setLoading(!loading)
      dispatch(clearUser())
      await removeItem("user")
      await removeItem("token")
    }
    catch (error) {
      console.error('Logout failed', error);
    } finally {
      setLoading(false)
    }

  }

  const renderTabContent = () => {
    if (activeTab === 'PostedItems') {
      return (
        <View style={styles.tabContent}>
          {/* Display the user's posted items here */}
          {/* You can use a FlatList or any other component to display the items */}
          {istherError ? <View>

            <Text>Failed to load</Text>
            <TouchableOpacity className="flex-row items-center bg-primary-blue gap-x-2">
              <Text className="text-md text-primary-white mr-1 ">refresh</Text>
              <TouchableOpacity style={{}} onPress={fetchUserItems}>
                <MaterialIcons name="refresh" size={25} color={"white"} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View> :
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              data={userPostedItems}
              style={{ marginBottom: 70 }}
              numColumns={2}
              renderItem={({ item }) => <Item item={item} />}
              keyExtractor={item => item.id}
            />
          }



        </View>
      );
    } else if (activeTab === 'Notifications') {
      return (
        <View style={styles.tabContent}>
          {/* Display the user's notifications here */}
          {/* You can use a FlatList or any other component to display notifications */}
          <Text>Your Notifications</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <Image
        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbIhi9l4npCGPNWMAc6szDbxp75kjB3c0R5w&usqp=CAU" }}
        style={styles.profileImage}
        resizeMode="cover"
      />
      <Text style={styles.profileName}>John Doe</Text>
      <TouchableOpacity className="bg-primary-blue rounded-xl   " onPress={handleLogout}>
        <Text className="text-primary-white px-6 py-3 text-[19px] ">
          Log out
        </Text>
      </TouchableOpacity>
      {/* <Text style={styles.profileBio}>Frontend Developer</Text> */}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'PostedItems' && styles.activeTab,
          ]}
          onPress={() => switchTab('PostedItems')}
        >
          <Text style={styles.tabText}>Posted Items</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Notifications' && styles.activeTab,
          ]}
          onPress={() => switchTab('Notifications')}
        >
          <Text style={styles.tabText}>Notifications</Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}

      {/* <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,



  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileBio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',

  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeTab: {
    borderColor: '#3498db',
  },
  tabContent: {
    width: '100%',
    height: "62%",
    marginBottom: 70,
    overflow: "hidden",
    // backgroundColor:"red"
  },
  editButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LostFoundProfileScreen;
