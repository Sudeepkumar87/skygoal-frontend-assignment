export default function LoadingSpinner({ size = 'medium' }){
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-10 h-10 border-4',
    large: 'w-16 h-16 border-4'
  };
  
  const borderSize = size === 'small' ? 'border-2' : 'border-4';
  
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} rounded-full border-t-transparent animate-spin`} />
    </div>
  )
}