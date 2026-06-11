import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import { User, Camera } from "lucide-react";
import { animateStagger } from "../utils/animations";
import { useNotification } from "../context/NotificationContext";

export function Profile() {
  const { currentUser, updateProfileData } = useAuth();
  const { show } = useNotification();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    animateStagger('.profile-card', 0);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalPhotoURL = currentUser?.photoURL;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${currentUser.uid}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Assuming user creates a bucket named 'avatars' in Supabase
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        finalPhotoURL = publicUrlData.publicUrl;
      }

      await updateProfileData(displayName, finalPhotoURL);
      show("Profile updated successfully!", "success");
    } catch (error) {
      console.error(error);
      show("Failed to update profile: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
      </div>

      <div className="card profile-card" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0 }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative' }}>
              {imageFile ? (
                <img src={URL.createObjectURL(imageFile)} alt="Avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={48} />
                </div>
              )}
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
              >
                <Camera size={16} />
              </button>
              <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files[0] && setImageFile(e.target.files[0])} />
            </div>
            <div style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={displayName} 
              onChange={e => setDisplayName(e.target.value)} 
              placeholder="e.g. John Doe"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
